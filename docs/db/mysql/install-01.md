# Docker 安装

## 安装 Docker 

参考 ：[Docker安装](/devops/docker/)

## 查找并获取 MySQL 镜像

```shell
docker search mysql # 查找镜像

docker pull mysql #　拉取最新版 mysql
```


## 运行 MySQL 镜像 

```shell
docker run -d --name mysql-server -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql
```
## 检查 MySQL 容器是否正常

```shell
docker ps # 查看是否有 mysql-server 容器是否正常

docker logs mysql-server  #  mysql-server r容器异常，查看启动日志
```

## 挂载 mysql 数据目录以及配置目录
```shell
mkdir -p /etc/mysql/conf.d # 创建存放配置目录的目录
mkdir -p /data/mysql/     # 创建存放数据目录的目录
```

###　Docker 拷贝数据目录、配置目录
```shell
docker cp mysql-server:/var/lib/mysql /data/mysql
docker cp mysql-server:/etc/mysql/conf.d /ect/mysql
```

### Docker 停止移除容器
```shell
docker stop mysql-server
docker rm mysql-server
```
### Docker 使用挂载卷启动容器 
```
docker run -d --name mysql-server -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -v /data/mysql:/var/lib/mysql -v /ect/mysql:/etc/mysql/conf.d mysql
```