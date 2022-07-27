## ZooKeeper 权限描述

当客户端尝试访问znode节点 （zooKeeper数据树的数据节点）时，将会检查 znode 的 ACL  （Access Control List），ACL 由`scheme:expression:permission` 对组成，表达式的格式特定于scheme。例如，该对`ip:19.22.0.0/16:r`为任何IP地址以19.22开头的客户端提供 READ 权限。每个 znode 的权限是独立的，子节点不会继承父节点的权限，客户端无权访问某节点，但可能可以访问它的子节点，所有节点的默认的权限为 `world:anyone:cdrwa` 也就是为所有客户端开发所有权限。每个 znode 支持设置多种权限控制方案和多个权限。多种权限控制方案以逗号分隔，例如：`setAcl /hiveserver2 sasl:hive:cdrwa,world:anyone:r`。

## ZooKeeper 权限类型（permission）

- **Create**：可以创建子节点

- **Delete**：可以删除节点

- **Read**：  可以从节点获取数据并列出其子节点

- **Write**： 可以为节点设置数据

- **Admin**： 可以进行权限设置

## ZooKeeper 访问控制列表方案（scheme）

- **world**：只有一个id 即 anyone，为所有 Client 端开放权限。

- **auth**： 不需要任何id，只要是通过auth的用户都有权限。

- **digest：** 端使用用户和密码的方式验证，采用username:BASE64(SHA1(password))的字符串作为节点ACL的id（如：digest:lyz:apNZxQYP6HbBQ9hRAibCkmPKGss=）。

- **IP**：使用客户端的IP地址作为ACL的id，可以设置为一个ip段（如：ip:192.168.0.1/8）。Client端由IP地址验证，譬如172.2.0.0/24



## 代码实战

### 获取 hello 节点的权限

```go
package main

import (
	"fmt"
	"time"

	"github.com/go-zookeeper/zk"
)

func main() {
	conn, _, err := zk.Connect([]string{"150.158.95.91:2181"}, time.Second)
	if err != nil {
		panic(err)
	}
	defer conn.Close()
	// 获取节点权限
	acl, _, err := conn.GetACL("/hello")
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("\nget acl:")
	fmt.Println("scheme =", acl[0].Scheme)
	fmt.Println("id =", acl[0].ID)
	fmt.Println("permissions =", acl[0].Perms)
}
```

### 设置 hello 节点所有人只读

```go
package main

import (
	"fmt"
	"time"

	"github.com/go-zookeeper/zk"
)

func main() {
	conn, _, err := zk.Connect([]string{"150.158.95.91:2181"}, time.Second)
	if err != nil {
		panic(err)
	}
	defer conn.Close()
	// 获取节点权限
	acl, state, err := conn.GetACL("/hello")
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("\nget acl:", acl)
	// 设置 /hello 节点 所有客户端只读
	conn.SetACL("/hello", zk.WorldACL(zk.PermRead), state.Version)
	// 再次获取权限
	acl, state, err = conn.GetACL("/hello")
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("\nget acl:", acl)
}
```

### 设置只有经过校验的客户端只读


