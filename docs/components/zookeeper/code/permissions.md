## ZooKeeper 权限描述

当客户端尝试访问znode节点 （zooKeeper数据树的数据节点）时，将会检查 znode 的 ACL  （Access Control List），ACL 由`scheme:expression:permission`对组成，表达式的格式特定于scheme。例如，该对`ip:19.22.0.0/16:r`为任何IP地址以19.22开头的客户端提供 READ 权限。每个 znode 的权限是独立的，子节点不会继承父节点的权限，客户端无权访问某节点，但可能可以访问它的子节点，所有节点的默认的权限为 `world:anyone:cdrwa` 也就是所有权限。每个 znode 支持设置多种权限控制方案和多个权限。多种权限控制方案以逗号分隔，例如：`setAcl /hiveserver2 sasl:hive:cdrwa,world:anyone:r`。

## ZooKeeper 权限类型

1. Create：允许对子节点Create操作

2. Delete：允许对子节点Delete操作

3. Read：   允许对本节点GetChildren和GetData操作，有对本节点进行删除操作的权限。

4. Write：允许对本节点SetData操作

5. Admin：允许对本节点setAcl操作




