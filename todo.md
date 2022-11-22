# 开发进度



### 11月16日
主要问题分析

1. 接口返回的数据格式不统一，特别是字段的命名格式
2. 数据渲染的条件不正规，导致数据格式的逻辑过于复杂


### 接口问题说明
1 数据冗余
`URL_CHAT_HISTORY_LIST` 返回的群聊记录需要根据条件筛选，比如 `WxId` 长度超过16

2 数据缺失，需要多个接口计算
`URL_CHAT_HISTORY_LIST` 返回的聊天消息的发送者的头像，需要通过 `URL_ROOM_MEMBER_LIST`获取遍历。

3 多次接口调用
URL_ROOM_CONTACT_LIST, URL_CONTACT_ALL_LIST, URL_CONTACT_USR_LIST 应该封装成1个统一返回

4 返回的数据格式不统一
有的时候是 `NickName` 有的时候是 `UserName`

5 接口没有返回结果
置顶类型的接口没有返回数据，无法判断调用是否成功

