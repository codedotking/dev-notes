## 仓库，镜像，容器的关系

仓库（Repository）是集中存放镜像 （Images）的地方，镜像的一个实例是容器（Container） 

## 仓库相关命令

### 登录仓库

```shell
docker login # 登录 docker_hub ，如果没有账号需要到 https://hub.docker.com 创建一个，然后在进行登录
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: 
```

### 退出登录

```shell
docer logout # 退出登录
```

## 镜像相关命令

### 镜像列表

```shell
docker images # 列出宿主机上所有的镜像列表

REPOSITORY                   TAG       IMAGE ID       CREATED         SIZE
hello-world                  latest    feb5d9fea6a5   10 months ago   13.3kB
```

**`REPOSITORY：`** 表示镜像的仓库源（镜像名称）；**`TAG`：** 镜像的标签；**`IMAGE ID`：** 镜像ID、**`CREATED`：** 镜像创建时间、**`SIZE`：** 镜像大小。

### 查找镜像

查找 redis 镜像

- 通过Docker Hub 进行查找, 比如[Docker Hub](https://hub.docker.com/search?q=mysql&type=image)。

- 通过 `docker search` 命令行查询镜像。
  
  ```shell
  docker search redis #  docker search iamges_name，iamges_name 为你想要查找的镜像名称
  
  NAME                                        DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
  redis                                       Redis is an open source key-value store that…   11171     [OK]       
  bitnami/redis                               Bitnami Redis Docker Image                      227                  [OK]
  bitnami/redis-sentinel                      Bitnami Docker Image for Redis Sentinel         39                   [OK]
  bitnami/redis-cluster                                                                       34                   
  rapidfort/redis-cluster                     RapidFort optimized, hardened image for Redi…   15                   
  rapidfort/redis                             RapidFort optimized, hardened image for Redi…   15                   
  circleci/redis                              CircleCI images for Redis                       14                   [OK]
  ubuntu/redis                                Redis, an open source key-value store. Long-…   10                   
  bitnami/redis-exporter                                                                      9                    
  google/guestbook-python-redis               A simple guestbook example written in Python…   5                    
  clearlinux/redis                            Redis key-value data structure server with t…   4                    
  ibmcom/redis-ha                                                                             1                    
  ibmcom/ibm-cloud-databases-redis-catalog    Catalog image for the IBM Operator for Redis    1                    
  bitnami/redis-sentinel-exporter                                                             1                    
  ibmcom/ibm-cloud-databases-redis-operator   Container image for the IBM Operator for Red…   1                    
  ibmcom/redis-ppc64le                                                                        0                    
  rancher/redislabs-ssl                                                                       0                    
  rapidfort/redis6-ib                         RapidFort optimized, hardened image for Redi…   0                    
  drud/redis                                  redis                                           0                    [OK]
  blackflysolutions/redis                     Redis container for Drupal and CiviCRM          0                    
  ibmcom/redisearch-ppc64le                                                                   0                    
  greenbone/redis-server                      A redis service container image for the Gree…   0                    
  vmware/redis-photon                                                                         0                    
  cimg/redis                                                                                  0                    
  newrelic/k8s-nri-redis                      New Relic Infrastructure Redis Integration (…   0                    
  ```

  **`NAME`**: 镜像仓库源的名称 ，**`DESCRIPTION`**: 镜像的描述； **`OFFICIAL`** ：是否 docker 官方发布  ； **AUTOMATED**: 自动构建。 

### 拉取镜像

在仓库中 `image:tag` 唯一识别一个镜像，如果安装的镜像是历史版本，则需要指定 `tag`

```shell
docker pull redis:latest # 表示拉取 name 为 redis 的最新版本的镜像，latest 为镜像的版本号
```

### 镜像删除

把一开始安装的 `hello-world` 测试镜像删除。

```shell
docker rmi hello-world
# Error response from daemon: conflict: unable to remove repository reference "hello-world" (must force) - container 74d7fe4df7bb is using its referenced image feb5d9fea6a5
```

删除失败，提示有一个容器正在使用这个镜像，我们需要把这个容器停止以及删除掉。

```shell
docker stop 74d7fe4df7bb
# 74d7fe4df7bb
docker rm 74d7fe4df7bb
# 74d7fe4df7bb
```

再次删除`hello-world`镜像。

```shell
docker rmi hello-world

# Untagged: hello-world:latest
# Untagged: hello-world@sha256:53f1bbee2f52c39e41682ee1d388285290c5c8a76cc92b42687eecf38e0af3f0
# Deleted: sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412
# Deleted: sha256:e07ee1baac5fae6a26f30cabfe54a36d3402f96afda318fe0a96cec4ca393359
```

删除成功。








