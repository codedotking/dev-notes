## redis 实现排行榜

在日常的业务逻辑中排行榜的功能十分常见，直接用 sql 中的 order by + limit 两个关键字就能实现，比如我们要实现一个书籍的阅读数量排行榜，阅读数量在前10的才能上榜。

```sql
select * from book_info order by read_num desc limit 0,10
```

但是如果数据量特别大的时候，在 sql 中进行排序的性能是比较差的，而且数据库的压力也会比较大。此时我们可以采用 redis 中的有序集合来实现。

**涉及的命令：** `zrange` 查看排行榜 (升序) ，`zrevrange` 查看排行榜 （降序），`zadd` 添加一个数据，`zrem` 删除一个数据，`zrank` 获取排名（升序），`zrevrank` 获取排名 （降序）

向 redis 中添加数据。 `zadd key score member [ score member ]`

```shell
zadd all_book_read_rank 100 '百年孤独' 200 '活着' 600 '西游记'
```

获取阅读量前 2个

```shell
ZREVRANGE all_book_read_rank 0 1
```

获取阅读量最后 2 个

```shell
ZRANGE all_book_read_rank 0 1
```

我想看一下西游记排在第几位（正数第几）

```shell
ZREVRANK all_book_read_rank '西游记'
```

我想看一下西游记排在第几位（也就是倒数第几）

```shell
ZRANK all_book_read_rank '西游记'
```

百年孤独违规了，需要移除掉

```shell
ZREM all_book_read_rank '百年孤独'
```

### Go语言实现

```go
package main

import (
    "fmt"

    "github.com/go-redis/redis"
)

func newClient() *redis.Client {
    client := redis.NewClient(&redis.Options{Addr: "127.0.0.1:6379", Password: "", DB: 0})
    _, err := client.Ping().Result()
    if err != nil {
        fmt.Println("connect redis error:", err)
        return nil
    }
    fmt.Println("connect redis success!")
    return client
}

func main() {
    client := newClient()
    defer client.Close()
    bookReadInfos := []redis.Z{}
    bookReadInfos = append(bookReadInfos, redis.Z{
        Score:  200,
        Member: "活着",
    })
    bookReadInfos = append(bookReadInfos, redis.Z{
        Score:  100,
        Member: "百年孤独",
    })
    bookReadInfos = append(bookReadInfos, redis.Z{
        Score:  600,
        Member: "西游记",
    })
    // 加入进排行榜
    res := client.ZAdd("book_read_rank", bookReadInfos...)
    fmt.Println(res)
    // 获取前 2 名
    rank2 := client.ZRevRange("book_read_rank", 0, 1)
    fmt.Println(rank2.Result())
    // 获取后 2 名
    last2 := client.ZRange("book_read_rank", 0, 1)
    fmt.Println(last2.Result())
    // 获取西游记正数几名
    revRankXiYouJi, _ := client.ZRank("book_read_rank", "西游记").Result()
    fmt.Println("西游记名次为，正数：", revRankXiYouJi)
    // 获取西游记倒数几名
    rankXiYouJi, _ := client.ZRank("book_read_rank", "西游记").Result()
    fmt.Println("西游记名次为，倒数：", rankXiYouJi)
    // 删除百年孤独
    flag, _ := client.ZRem("book_read_rank", "百年孤独").Result()
    if flag == 1 {
        fmt.Println("删除成功")
    } else {
        fmt.Println("删除失败")
    }
}


// connect redis success!
// zadd book_read_rank 200 活着 100 百年孤独 600 西游记: 3
// [西游记 活着] <nil>
// [百年孤独 活着] <nil>
// 西游记名次为，正数： 2
// 西游记名次为，倒数： 2
// 删除成功
```