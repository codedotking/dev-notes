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

参数说明：**`REPOSITORY：`** 表示镜像的仓库源（镜像名称）；**`TAG`：** 镜像的标签；**`IMAGE ID`：** 镜像ID、**`CREATED`：** 镜像创建时间、**`SIZE`：** 镜像大小。

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

   参数说明：**`NAME`**: 镜像仓库源的名称 ，**`DESCRIPTION`**: 镜像的描述； **`OFFICIAL`** ：是否 docker 官方发布  ； **AUTOMATED**: 自动构建。 

### 拉取镜像

在仓库中 `image:tag` 唯一识别一个镜像，如果安装的镜像是历史版本，则需要指定 `tag`

```shell
docker pull redis:latest # 表示拉取 name 为 redis 的最新版本的镜像，latest 为镜像的版本号
```

### 镜像删除

把一开始安装的 `hello-world` 测试镜像删除。

```shell
docker rmi hello-world
Error response from daemon: conflict: unable to remove repository reference "hello-world" (must force) - container 74d7fe4df7bb is using its referenced image feb5d9fea6a5
```

删除失败，提示有一个容器正在使用这个镜像，我们需要把这个容器停止以及删除掉。

```shell
docker stop 74d7fe4df7bb
74d7fe4df7bb
docker rm 74d7fe4df7bb
74d7fe4df7bb
```

再次删除`hello-world`镜像。

```shell
docker rmi hello-world

Untagged: hello-world:latest
Untagged: hello-world@sha256:53f1bbee2f52c39e41682ee1d388285290c5c8a76cc92b42687eecf38e0af3f0
Deleted: sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412
Deleted: sha256:e07ee1baac5fae6a26f30cabfe54a36d3402f96afda318fe0a96cec4ca393359
```

删除成功。

### 生成镜像

当我们从 docker 镜像仓库中下载的镜像不能满足我们的需求时，我们可以通过以下两种方式对镜像进行更改。

1. 从已经创建的容器内部添加内容，然后利用 `docker commit` 提交这个容器作为一个新的镜像。
   
   现在我们有一个正在运行的 reids 容器，容器里面没有 vim ，我们需要进入 redis 容器，使用 apt-get 安装 vim，然后将此容器提交成一个新的镜像。tall vim -y # 安装 vim 。
   
   ```bash
   docker eec -it redis-server /bin/bash # 进入容器
   
   apt-get update # 更新数据源列表，获取最新软件源
   apt-get ins
   ```
   
   通过 `docker commit`  提交包含 `vim` 的 `redis-server`容器，作为新的一个镜像。
   
   ```shell
   docker commit -m "包含 vim 的 redis 镜像" -a "hewenyao" redis-server hewenyao/redis:V1
   sha256:f72145235828bb004028d0a96e991e81135defa38c6bfea124913da11cab8792
   ```
   
   参数说明： **-m:** 提交的描述信息；**-a:** 指定镜像作者；**redis-server：** 容器名称；**hewenyao/reids:V1:** 指定要创建的目标镜像名。
   
   通过 `docker images`查看本地镜像列表，查看刚刚生成的镜像。
   
   ```shell
   docker images 
   
   REPOSITORY                   TAG       IMAGE ID       CREATED         SIZE
   hewenyao/redis               V1        acb489c5c871   9 seconds ago   171MBB
   ```
   
   使用 `hewenyao/redis` 镜像启动一个容器
   
   ```shell
   docker run -d --name vim-redis hewenyao/redis:V1
   ```
   
   进入 `vim-redis` 容器查看是否含有 `vim` 命令
   
   ```shell
   docker exec -it vim-redis /bin/bash 
   vim
   ```
   
   进入编辑，不报错，说明 vim 已经在新的镜像里，镜像生成成功

2. 使用 `docker build` 和 `Dockerfile`  从零开始来创建一个新的镜像，`Dockerfile` 描述了一组指令用于构建镜像。
   编写 `Dockerfile`
   
   ```shell
   FROM nginx
   RUN echo '这是一个本地构建的nginx镜像' > /usr/share/nginx/html/index.html
   ```
   
   `Dockerfile` 中每一个指令都会在镜像上创建一个新的层，每一个指令的前缀都必须是大写的。第一条FROM，指定使用哪个镜像源，RUN 指令告诉 `Docker`在镜像内执行什么命令，然后，我们使用 `Dockerfile`文件，通过 docker build 命令来构建一个镜像。上述 `Dockerfile`得到一个主页默认内容为**这是一个本地构建的nginx镜像** 的镜像。
   
   使用 `docker build ` 构建新的镜像。
   
   ```shell
    docker build -t hewenyao/nginx .
   
   Sending build context to Docker daemon  2.048kB
   Step 1/2 : FROM nginx
    ---> 670dcc86b69d
   Step 2/2 : RUN echo '这是一个本地构建的nginx镜像' > /usr/share/nginx/html/index.html
    ---> Running in e94bbd026b86
   Removing intermediate container e94bbd026b86
    ---> d724276ffec2
   Successfully built d724276ffec2
   Successfully tagged hewenyao/nginx:latest
   ```
   
   参数说明：`-t` ：指定要创建的目标镜像名；`.` ：Dockerfile 文件所在目录，可以指定Dockerfile 的绝对路径。
   
   使用 `docker images` 查看镜像列表。
   
   ```shell
   docker images
   
   REPOSITORY                   TAG       IMAGE ID       CREATED              SIZE
   hewenyao/nginx               latest    d724276ffec2   About a minute ago   142MB
   ```
   
   使用 `hewenyao/nginx`启动一个容器，然后访问 `localhost:80`。
   
   ```shell
   docker run -d --name test-nginx -p 80:80 hewenyao/nginx
   030d494776e6e5a698cc4bf8488c5b2f1f570ea060a50f52507ca1aa4a59fac0
   curl localhost:80
   是一个本地构建的nginx镜像
   ```
   
   镜像构建成功。

### 镜像标签

我们可以使用 ` docker tag` 命令，为镜像添加一个新的标签（或是新的名称）。

```shell
docker tag hewenyao/nginx hewenyao/nginx:V1
```

`docker images` 查看镜像列表。

```shell
docker images
REPOSITORY                   TAG       IMAGE ID       CREATED          SIZE
hewenyao/nginx               V1        d724276ffec2   12 minutes ago   142MB
hewenyao/nginx               latest    d724276ffec2   12 minutes ago   142MB
```


