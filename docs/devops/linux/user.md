## 查看系统内用户列表

```shell
cat /etc/passwd
# root:x:0:0:root:/root:/bin/bash
# daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
# bin:x:2:2:bin:/bin:/usr/sbin/nologin
```
**每一行都包含由冒号(:)分隔的特定用户的各种详细信息。单行包含以冒号(:)分隔的以下详细信息。**

Username, Password, GID, UID, 主目录路径, 用户详细信息, 默认 Shell

## 创建用户
保证当前所处环境为 root 或者用 sudo
```shell
useradd elatic0 # 添加一个名为 elatic 的用户，接下来根据提示设置用户密码
# 创建用户目录
useradd -m elatic1 # 这种写法会在 /home 目录下创建用户目录，上面的写法并不会创建
# 指定用户目录为 /testhome 
useradd -m -d /testhome elatic2 # 这种写法创建用户目录 /testhome
# 创建一个具有过期时间的用户
useradd -m -d /home/test-elatic -e 2022-11-16 elatic3
```


## 修改用户密码

```shell
passwd elatic
```
