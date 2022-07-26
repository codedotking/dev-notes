# nginx https 配置

> 将现有项目从 http 升级到 https

## docker 版

### 创建挂载目录

```shell
mkdir -p /opt/nginx/config # 存放配置文件
mkdir -p /opt/nginx/html   # 存放 静态文件
mkdir -p /opt/nginx/config/cert   # 存放 https 证书
mkdir -p /var/log/nginx    # 存放日志
```

### 上传 https 证书

申请完证书后，将证书上传到 `/opt/nginx/cert`

### 编写 nginx.conf

```nginx
# https://cloud.tencent.com/document/product/400/35244 参考文档
server {
    listen 80;
    #请填写绑定证书的域名
    server_name blog.hewenyao.top;
    #把http的域名请求转成https
    return 301 https://$host$request_uri; 
}

server {
    #SSL 默认访问端口号为 443
    listen 443 ssl; 
    #请填写绑定证书的域名
    server_name blog.hewenyao.top; 
    #请填写证书文件的相对路径或绝对路径
    ssl_certificate /etc/nginx/config/cert/blog.hewenyao.top_bundle.crt; 
    #请填写私钥文件的相对路径或绝对路径
    ssl_certificate_key /etc/nginx/config/cert/blog.hewenyao.top.key; 
    ssl_session_timeout 5m;
    #请按照以下协议配置
    ssl_protocols TLSv1.2 TLSv1.3; 
    #请按照以下套件配置，配置加密套件，写法遵循 openssl 标准。
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE; 
    ssl_prefer_server_ciphers on;
    location / {
        #网站主页路径。此路径仅供参考，具体请您按照实际目录操作。
        #例如，您的网站主页在 Nginx 服务器的 /etc/www 目录下，则请修改 root 后面的 html 为 /etc/www。
        root /usr/share/nginx/html; 
        index  index.html index.htm;
    }
}
```

### 启动命令

```shell
docker stop nginx-server
docker rm nginx-server
docker run   --name nginx-server \
        -p 443:443\
        -p 80:80 \
        -v /opt/nginx/html/:/usr/share/nginx/html \
        -v /opt/nginx/config/nginx.conf:/etc/nginx/nginx.conf \
        -v /opt/nginx/config/conf.d:/etc/nginx/conf.d \
        -v /opt/nginx/config/cert:/etc/nginx/cert \
        -v /var/log/nginx/:/var/log/nginx \
        --network mynet --network-alias nginxserver \
        -d nginx
```

### 进入容器内部

```shell
docker exec -it nginx-server /bin/bash
```

### 部署新的域名访问 kibana

```nginx
# https://cloud.tencent.com/document/product/400/35244 参考
server {
    listen 80;
    #请填写绑定证书的域名
    server_name kibana.hewenyao.top;
    #把http的域名请求转成https
    return 301 https://$host$request_uri; 
}

server {
    #SSL 默认访问端口号为 443
    listen 443 ssl; 
    #请填写绑定证书的域名
    server_name kibana.hewenyao.top;
    #请填写证书文件的相对路径或绝对路径
    ssl_certificate /etc/nginx/cert/kibana.hewenyao.top_bundle.crt; 
    #请填写私钥文件的相对路径或绝对路径
    ssl_certificate_key /etc/nginx/cert/kibana.hewenyao.top.key; 
    ssl_session_timeout 5m;
    #请按照以下协议配置
    ssl_protocols TLSv1.2 TLSv1.3; 
    #请按照以下套件配置，配置加密套件，写法遵循 openssl 标准。
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE; 
    ssl_prefer_server_ciphers on;
    location / {
        proxy_pass http://kibanaserver:5601;
    }
}
```