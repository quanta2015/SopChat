
```bash
# ReceiveChatMessage 普通聊天消息
1. 文本/图片/视频/音乐消息
处理逻辑：将聊天消息添加到聊天记录列表
触发条件：在聊天对话框输入文本/图片/视频/音乐发送，并且更新`未读数量`角标

2. 图文链接消息
处理逻辑：将图文链接添加到聊天记录列表
触发条件：在聊天对话框输入图文链接发送，并且更新`未读数量`角标

3. 小程序消息
处理逻辑：将小程序链接添加到聊天记录列表
触发条件：在聊天对话框输入小程序发送，并且更新`未读数量`角标

4. 不支持消息
处理逻辑：omit该消息，不做处理

5. 转交消息
- 60001[转交]: 如果是转交给我的消息，则添加到`处理中`列表; 否则是我转交出去的，修改转交标识数据
- 60002[收回]: 则清除转交标识数据
- 60003[退回]: 如果是转交给我的消息，从`处理中`列表删除该用户; 否则清除转交标识数据

6. 添加删除群成员消息提示[11072/11073]
处理逻辑：将群成员的添加和删除提示信息添加到聊天记录列表
触发条件：在群聊中删除某个人员或者拉入某个人员

7. 异常退出企微账号
处理逻辑：将退出的虚拟客户经理从企微列表中删除
触发条件：？

8. 创建群
处理逻辑：用提示框显示群的创建信息
触发条件：用 hook 账号创建群聊

9. 客户自动关闭机器人
处理逻辑：设置全局的 `BotSetting`
触发条件：后台修改虚拟客户经理的机器人状态


# UpdateRoomMsg
1. 更新角标: 
处理逻辑: 如果消息 ConversationId 存在，更新 `UnreadMsgCount、LastChatTimestamp`
处理逻辑: 在群聊里面发送新的消息

2. 添加群聊
处理逻辑: 如果消息 ConversationId 不存在，则添加到群聊列表
处理逻辑: 在企业微信里面新建群聊


# SynExternalUsers
1. 新客户加入
处理逻辑：将新客户添加到【客户】列表
触发条件：使用新的微信账号扫码加【虚拟客户经理】


# UpdateExternalUsers
处理逻辑：更新 `UnreadMsgCount、LastChatTimestamp、IsDelete、CurrentReceiptionStatus`
触发条件：将【虚拟客户经理】从联系人删除时


# NewExternalUsers
1. 分配新客户
处理逻辑：将该客户加入 `处理中` 列表
触发条件：后台分配把某个客户分配给虚拟客户经理


# LogoutMessage/LoginMessage
处理逻辑：更新【虚拟客户经理】列表
触发条件：用户下线或者登录
```