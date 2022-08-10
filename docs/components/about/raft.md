# 分布式算法 - Raft

## 提出背景

在分布式系统中，一致性算法至关重要。在所有一致性算法中，Paxos 最负盛名，它由莱斯利·兰伯特（Leslie Lamport）于 1990 年提出，是一种基于消息传递的一致性算法，被认为是类似算法中最有效的。

Paxos 算法虽然很有效，但复杂的原理使它实现起来非常困难，截止目前，实现 Paxos 算法的开源软件很少，比较出名的有 Chubby、LibPaxos。此外，Zookeeper 采用的 ZAB（Zookeeper Atomic Broadcast）协议也是基于 Paxos 算法实现的，不过 ZAB 对 Paxos 进行了很多改进与优化，两者的设计目标也存在差异——ZAB 协议主要用于构建一个高可用的分布式数据主备系统，而 Paxos 算法则是用于构建一个分布式的一致性状态机系统。

由于 Paxos 算法过于复杂、实现困难，极大地制约了其应用，而分布式系统领域又亟需一种高效而易于实现的分布式一致性算法，在此背景下，Raft 算法应运而生。

Raft 算法在斯坦福 Diego Ongaro 和 John Ousterhout 于 2013 年发表的《In Search of an Understandable Consensus Algorithm》中提出。相较于 Paxos，Raft 通过逻辑分离使其更容易理解和实现，目前，已经有十多种语言的 Raft 算法实现框架，较为出名的有 etcd、Consul 。

## Raft 中节点角色

一个 Raft 集群包含若干节点，Raft 把这些节点分为三种状态：**Leader**、 **Follower**、**Candidate**，每种状态负责的任务也是不一样的。正常情况下，集群中的节点只存在 **Leader** 与 **Follower** 两种状态。

- **Leader**（领导者） ：负责日志的同步管理，处理来自客户端的请求，与 **Follower** 保持 **heartBeat** 的联系。
- **Follower**（追随者） ：响应 **Leader** 的日志同步请求，响应 **Candidate** 的邀票请求，以及把客户端请求到 **Follower** 的事务转发（重定向）给 **Leader**。
- **Candidate**（候选者） ：负责选举投票，集群刚启动或者 **Leader** 宕机时，状态为 **Follower** 的节点将转为 **Candidate** 并发起选举，选举胜出（获得超过半数节点的投票）后，从 **Candidate** 转为 **Leader** 状态。

<img title="" src="https://raw.githubusercontent.com/hewneyao/dev-notes/main/docs/public/images/raft/raft-role.png" alt="" data-align="center" width="249">

## Raft 三个子问题

通常，Raft 集群中只有一个 Leader，其它节点都是 Follower。Follower 都是被动的，不会发送任何请求，只是简单地响应来自 Leader 或者 Candidate 的请求。Leader 负责处理所有的客户端请求（如果一个客户端和 Follower 联系，那么 Follower 会把请求重定向给 Leader）。

为简化逻辑和实现，Raft 将一致性问题分解成了三个相对独立的子问题：

- 选举（Leader Election） ：当 Leader 宕机或者集群初创时，一个新的 Leader 需要被选举出来；
- 日志复制（Log Replication） ：Leader 接收来自客户端的请求并将其以日志条目的形式复制到集群中的其它节点，并且强制要求其它节点的日志和自己保持一致；
- 安全性（Safety） ：如果有任何的服务器节点已经应用了一个确定的日志条目到它的状态机中，那么其它服务器节点不能在同一个日志索引位置应用一个不同的指令。

## Raft Leader Election 过程

根据 Raft 协议，一个应用 Raft 协议的集群在刚启动时，所有节点的状态都是 Follower。由于没有 Leader，Followers 无法与 Leader 保持心跳（Heart Beat），因此，Followers 会认为 Leader 已经下线，进而转为 Candidate 状态。然后，Candidate 将向集群中其它节点请求投票，同意自己升级为 Leader。如果 Candidate 收到超过半数节点的投票（N/2 + 1），它将获胜成为 Leader。

#### 第一阶段：所有节点都是 Follower

上面提到，一个应用 Raft 协议的集群在刚启动（或 Leader 宕机）时，所有节点的状态都是 Follower，初始 Term（任期）为 0。同时启动选举定时器，每个节点的选举定时器超时时间都在 100~500 毫秒之间且并不一致（避免同时发起选举）。

<img title="" src="https://raw.githubusercontent.com/hewneyao/dev-notes/main/docs/public/images/raft/election-01.jpg" alt="" data-align="center" width="249">

#### 第二阶段：Follower 转为 Candidate 并发起投票

没有 Leader，Followers 无法与 Leader 保持心跳（Heart Beat），节点启动后在一个选举定时器周期内未收到心跳和投票请求，则状态转为候选者 Candidate 状态，且 Term 自增，并向集群中所有节点发送投票请求并且重置选举定时器。

注意，由于每个节点的选举定时器超时时间都在 100-500 毫秒之间，且彼此不一样，以避免所有 Follower 同时转为 Candidate 并同时发起投票请求。换言之，最先转为 Candidate 并发起投票请求的节点将具有成为 Leader 的“先发优势”。

<img title="" src="https://raw.githubusercontent.com/hewneyao/dev-notes/main/docs/public/images/raft/election-02.jpg" alt="" data-align="center" width="249">

#### 第三阶段：投票策略

节点收到投票请求后会根据以下情况决定是否接受投票请求（每个 follower 刚成为 Candidate 的时候会将票投给自己）：

请求节点的 Term 大于自己的 Term，且自己尚未投票给其它节点，则接受请求，把票投给它；

请求节点的 Term 小于自己的 Term，且自己尚未投票，则拒绝请求，将票投给自己。

<img title="" src="https://raw.githubusercontent.com/hewneyao/dev-notes/main/docs/public/images/raft/election-03.jpg" alt="" style="width=500" data-align="center" width="432">

#### 第四阶段：Candidate 转为 Leader

一轮选举过后，正常情况下，会有一个 Candidate 收到超过半数节点（N/2 + 1）的投票，它将胜出并升级为 Leader。然后定时发送心跳给其它的节点，其它节点会转为 Follower 并与 Leader 保持同步，到此，本轮选举结束。

注意：有可能一轮选举中，没有 Candidate 收到超过半数节点投票，那么将进行下一轮选举。

<img title="" src="https://raw.githubusercontent.com/hewneyao/dev-notes/main/docs/public/images/raft/election-04.jpg" alt="" data-align="center" width="249">

## Raft Log Replication 原理

待续 。。。。
