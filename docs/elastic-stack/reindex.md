## 创建索引模板

```json
PUT _template/product_info_template
{
  "order": 0,
  "index_patterns": [
    "product_info_*"
  ],
  "mappings": {
    "properties": {
      "annual_rate": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "describe": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "productName": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      }
    }
  },
  "settings": {
    "index": {
      "number_of_shards": "1",
      "number_of_replicas": "1"
    }
  },
  "aliases": {
    "all_product_info": {}
  }
}
```

## product_info_202205 reindex 流程

### 1. 先创建需要备份数据的索引 `product_info_202205_v2`

使用 product_info_template 创建一个新的索引product_info_202205_v2，保证和其他月份的索引配置一样。**确保 product_info_template 已存在。**

```json
PUT product_info_202205_v2
```

### 2. 修改 索引 number_of_replicas和refresh_interval

```json
PUT /product_info_202205_v2/_settings
{
  "refresh_interval": "-1",
  "number_of_replicas": 0
}
```

- 设置`number_of_replicas`为`0`防止我们迁移文档的同时又发送到副本节点，影响性能
- 设置`refresh_interval`为`-1`是限制其刷新。默认是1秒
- 当我们数据迁移完成再把上面两个值进行修改即可

### 3. 删除 `product_info_202205_v2` 的别名

保证 product_info_202205_v2 在数据据迁移时， 不要被 `all_product_info` 检索到，如果不删除会导致业务逻辑中查询数据重复

```json
POST _aliases
{
  "actions": [
    {
      "remove": {
        "index": "product_info_202205_v2",
        "alias": "all_product_info"
      }
    }
  ]
}
```

### 4. 开始迁移数据

```json
POST _reindex
{
  "source": {
    "index": "product_info_202205"
  },
  "dest": {
    "index": "product_info_202205_v2"
  }
}
```

### 5. 使用新 `product_info_202205_v2`

1. 因为需要给 `product_info_202205_v2` 起两个别名，而其中一个别名和备份的索引 `product_info_202205`名称一样,所以需要先删除 `product_info_202205` 索引，然后再添加 `product_info_202205_v2`的别名 `all_product_info, product_info_202205`, 这样 `product_info_202205_v2`就代替了之前的 `product_info_202205`而不用改代码。
   
   ```json
   DELETE product_info_202205 # 删除旧的索引 product_info_202205
   POST _aliases
   {
     "actions": [
       {
         "add": {
           "index": "product_info_202205_v2",
           "alias": "product_info_202205"
         }
       },
       {
         "add": {
           "index": "product_info_202205_v2",
           "alias": "all_product_info"
         }
       }
     ]
   }
   ```
   
   **注意：** 删除 `product_info_202205` 时有风险，删除`product_info_202205`时如果有直接访问当前索引的会ES会报索引找不到的错误，需要立马执行下一句，将 `product_info_202205_v2`加入到`all_product_info`的管理中。

2. 如果``product_info_202205_v2 备份到 `product_info_202205_v3` ，我们可以用一条命令来完成 索引的转换，然后在删除 `product_info_202205_v2`索引。
   
   ```json
   POST _aliases
   {
     "actions": [
       {
         "remove": {
           "index": "product_info_202205_v2",
           "alias": "product_info_202205"
         }
       },
       {
         "add": {
           "index": "product_info_202205_v3",
           "alias": "product_info_202205"
         }
       },
       {
         "add": {
           "index": "product_info_202205_v3",
           "alias": "all_product_info"
         }
       }
     ]
   }
   ```

### 6. 恢复索引  number_of_replicas和refresh_interval

```json
```json
PUT /product_info_202205_v2/_settings
{
  "refresh_interval": "5",
  "number_of_replicas": 1
}
```

```
## reindex 时修改字段名、删除字段

>  在将 product_info_202101 备份到 product_info_202101_v2 时，我们需要把 product_info_202101_v2 中文档的 id 设置为 aweme_id,以及删除`@version` 和 `@timestamp` 两个字段

```json
POST _reindex
{
  "source": {
    "index": "product_info_202101"
  },
  "dest": {
    "index": "product_info_202101_v2"
  },
  "script": {
    "source": "ctx._id = ctx._source.aweme_id;ctx._source.remove(\"@version\");ctx._source.remove(\"@timestamp\");"
  }
}
```

## 使用 duplicate_docs 查询五月数据中 aweme_id 重复两个以上的数据

查询五月数据中 aweme_id 重复两个以上的数据。

```json
GET product_info_202205
{
  "size": 0,
  "aggs": {
    "duplicate_docs": {
      "terms": {
      "field": "aweme_id",
        "min_doc_count": 2
      },
      "aggs": {
        "duplicate_docs_info": {
          "top_hits": {}
        }
      }
    }
  }
}
```

## 防止重复插入

再插入数据时指定文档 `_id`, 如果 索引中有 对应的`_id`则文档会更新，否则会加入到索引中。
