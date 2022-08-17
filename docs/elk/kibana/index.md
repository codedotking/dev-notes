## 安装 Kibana

### Docker 安装

```shell
dcoker pull kibana:7.14.0
```

### 运行临时容器

```shell
#运行kibana 注意IP一定不要写错
docker run --name kibana-server -e ELASTICSEARCH_HOSTS=http://es-server:9200 -p 5601:5601 --network bridge -d kibana:7.14.0
```

### 进入 Kibana 容器

```shell
docker exec -it kibana-server /bin/bash
```

#### 查找 kibana.yml 文件位置

```shell
find / -name kibana.yml # /usr/share/kibana/config/kibana.yml
```

### 拷贝 kibana-server容器中 kibana.yml 文件

```shell
mkdir -p /opt/kibana/config/
docker cp kibana-server:/usr/share/kibana/config/kibana.yml /opt/kibana/config
```

### 修改 /opt/kibana/config/kibana.yml

```
#
# ** THIS IS AN AUTO-GENERATED FILE **
#

# Default Kibana configuration for docker target
server.host: "0"
server.shutdownTimeout: "5s"
elasticsearch.hosts: [ "http://esserver:9200" ]
monitoring.ui.container.elasticsearch.enabled: true
```

### 挂载数据卷运行容器

```shell
docker stop kibana-server
docker rm kibana-server
docker run --name kibana-server -p 5601:5601 \
-v /opt/kibana/config/kibana.yml:/usr/share/kibana/config/kibana.yml \
--network mynet --network-alias kibanaserver \
-d kibana:7.14.0
```
