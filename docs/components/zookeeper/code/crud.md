## 创建新节点

- 持久节点
- 临时节点
- 持久时序节点
- 临时时序节点

```go
package main

import (
    "time"

    "github.com/go-zookeeper/zk"
)

func main() {

    conn, _, err := zk.Connect([]string{"xxx.xxx.xxx.xxx:2181"}, time.Second)
    if err != nil {
        panic(err)
    }
    defer conn.Close()
    // 创建持久节点
    path, err := conn.Create("/hello", []byte("world"), 0, zk.WorldACL(zk.PermAll))
    if err != nil {
        panic(err)
    }
    println("Created", path)

    // 创建临时节点，创建此节点的会话结束后立即清除此节点
    ephemeral, err := conn.Create("/ephemeral", []byte("1"), zk.FlagEphemeral, zk.WorldACL(zk.PermAll))
    if err != nil {
        panic(err)
    }
    println("Ephemeral node created:", ephemeral)

    // 创建持久时序节点
    sequence, err := conn.Create("/sequence", []byte("1"), zk.FlagSequence, zk.WorldACL(zk.PermAll))
    if err != nil {
        panic(err)
    }
    println("Sequence node created:", sequence)

    // 创建临时时序节点，创建此节点的会话结束后立即清除此节点
    ephemeralSequence, err := conn.Create("/ephemeralSequence", []byte("1"), zk.FlagEphemeral|zk.FlagSequence, zk.WorldACL(zk.PermAll))
    if err != nil {
        panic(err)
    }
    println("Ephemeral-Sequence node created:", ephemeralSequence)

}
```

## 查询 hello 节点信息

```go
package main

import (
	"fmt"
	"time"

	"github.com/go-zookeeper/zk"
)

func main() {
	conn, _, err := zk.Connect([]string{"xxx.xxx.xxx.xxx:2181"}, time.Second)
	if err != nil {
		panic(err)
	}
	defer conn.Close()
	result, state, err := conn.Get("/hello")
	if err != nil {
		panic(err)
	}
	fmt.Println("result: ", string(result))
	fmt.Println("state ->")
	fmt.Printf("cZxid=%d\nctime=%d\nmZxid=%d\nmtime=%d\npZxid=%d\ncversion=%d\ndataVersion=%d\naclVersion=%d\nephemeralOwner=%v\ndataLength=%d\nnumChildren=%d\n", state.Czxid, state.Ctime, state.Mzxid, state.Mtime, state.Pzxid, state.Cversion, state.Version, state.Aversion, state.EphemeralOwner, state.DataLength, state.NumChildren)
}


```

**执行结果**

```shell
2022/07/27 18:05:18 connected to xxx.xxx.xxx.xxx:2181
2022/07/27 18:05:18 authenticated: id=72070501693456393, timeout=4000
2022/07/27 18:05:18 re-submitting `0` credentials after reconnect
result:  world
state ->
cZxid=2
ctime=1658915345882
mZxid=2
mtime=1658915345882
pZxid=2
cversion=0
dataVersion=0
aclVersion=0
ephemeralOwner=0
dataLength=5
numChildren=0
2022/07/27 18:05:18 recv loop terminated: EOF
2022/07/27 18:05:18 send loop terminated: <nil>
```



## 修改 hello 节点信息

```go
package main

import (
	"fmt"
	"time"

	"github.com/go-zookeeper/zk"
)

func main() {
	conn, _, err := zk.Connect([]string{"xxx.xxx.xxx.xxx:2181"}, time.Second)
	if err != nil {
		panic(err)
	}
	defer conn.Close()
	path := "/hello"
	_, state, err := conn.Get(path)
	if err != nil {
		panic(err)
	}
	state, err = conn.Set(path, []byte("girl"), state.Version)
	if err != nil {
		panic(err)
	}
	fmt.Println("state ->")
	fmt.Printf("cZxid=%d\nctime=%d\nmZxid=%d\nmtime=%d\npZxid=%d\ncversion=%d\ndataVersion=%d\naclVersion=%d\nephemeralOwner=%v\ndataLength=%d\nnumChildren=%d\n", state.Czxid, state.Ctime, state.Mzxid, state.Mtime, state.Pzxid, state.Cversion, state.Version, state.Aversion, state.EphemeralOwner, state.DataLength, state.NumChildren)

	data, _, err := conn.Get(path)
	if err != nil {
		panic(err)
	}
	fmt.Println("\nnew value: ", string(data))
}

```

**执行结果**

```shell
2022/07/27 18:10:41 connected to xxx.xxx.xxx.xxx:2181
2022/07/27 18:10:41 authenticated: id=72070501693456395, timeout=4000
2022/07/27 18:10:41 re-submitting `0` credentials after reconnect
state ->
cZxid=2
ctime=1658915345882
mZxid=28
mtime=1658916641204
pZxid=2
cversion=0
dataVersion=1
aclVersion=0
ephemeralOwner=0
dataLength=4
numChildren=0

new value:  girl
2022/07/27 18:10:41 recv loop terminated: EOF
2022/07/27 18:10:41 send loop terminated: <nil>
```

## 删除 hello 节点



```go
package main

import (
	"fmt"
	"time"

	"github.com/go-zookeeper/zk"
)

func main() {
	conn, _, err := zk.Connect([]string{"xxx.xxx.xxx.xxx:2181"}, time.Second)
	if err != nil {
		panic(err)
	}
	defer conn.Close()
	path := "/hello"
	exists, state, err := conn.Exists(path)
	fmt.Printf("\npath[%s] exists: %v\n", path, exists)

	err = conn.Delete(path, state.Version)
	if err != nil {
		panic(err)
	}
	fmt.Printf("path[%s] is deleted.", path)

	exists, _, err = conn.Exists(path)
	fmt.Printf("\npath[%s] exists: %v\n", path, exists)
}
```

**执行结果**

```shell
2022/07/27 18:12:46 connected to xxx.xxx.xxx.xxx:2181
2022/07/27 18:12:46 authenticated: id=72070501693456396, timeout=4000
2022/07/27 18:12:46 re-submitting `0` credentials after reconnect

path[/hello] exists: true
path[/hello] is deleted.
path[/hello] exists: false
2022/07/27 18:12:46 recv loop terminated: EOF
2022/07/27 18:12:46 send loop terminated: <nil>
```