## Docker 安装 ZooKeeper

### 拉取镜像

```shell
docker pull zookeeper  # 默认拉取最新的zookeeper镜像 
```

### 运行临时容器

运行容器

```shell
docker run -d --name zookeeper-temp zookeeper
```

查看 zookeeper 容器内配置文件、数据、日志所在目录

```shell
docker inspect zookeeper-temp
```

截取其中的一部分

```json
{
    "Config": {
        "Env": [
                "PATH=/usr/local/openjdk-11/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/apache-zookeeper-3.8.0-bin/bin",
                "JAVA_HOME=/usr/local/openjdk-11",
                "LANG=C.UTF-8",
                "JAVA_VERSION=11.0.16",
                "ZOO_CONF_DIR=/conf",
                "ZOO_DATA_DIR=/data",
                "ZOO_DATA_LOG_DIR=/datalog",
                "ZOO_LOG_DIR=/logs",
                "ZOO_TICK_TIME=2000",
                "ZOO_INIT_LIMIT=5",
                "ZOO_SYNC_LIMIT=2",
                "ZOO_AUTOPURGE_PURGEINTERVAL=0",
                "ZOO_AUTOPURGE_SNAPRETAINCOUNT=3",
                "ZOO_MAX_CLIENT_CNXNS=60",
                "ZOO_STANDALONE_ENABLED=true",
                "ZOO_ADMINSERVER_ENABLED=true",
                "ZOOCFGDIR=/conf"
        ]
    }
}
```

在上面的信息中可以看出，zookeeper 在容器内使用到的配置文件、数据目录以及日志相关的目录。`ZOO_CONF_DIR=/conf`,`ZOO_DATA_DIR=/data`,`ZOO_DATA_LOG_DIR=/datalog`,`ZOO_LOG_DIR=/logs`

### 创建挂载目录

```shell
mkdir -p /etc/docker/zoo/conf
mkdir -p /data/docker/zoo/data
mkdir -p /var/log/zoo/datalog
mkdir -p /var/log/zoo/logs
```

### 拷贝容器内配置文件到宿主机

```shell
docker cp zookeeper-temp:/conf /etc/docker/zoo

ll /etc/docker/zoo # 查看一下
```

### 挂载数据卷启动容器

```shell
# 删除之前临时容器
docker stop zookeeper-temp
docker rm zookeeper-temp

# 启动新的容器
docker run -d --restart=always --name zookeeper-server -p 2181:2181 \
-v /etc/docker/zoo/conf:/conf \
-v /data/docker/zoo/data:/data \
-v /var/log/zoo/datalog:/datalog \
-v /var/log/zoo/logs:/logs \
zookeeper
```