import { toJS } from 'mobx'
import { MSG,RenderMsgDetail,updateLastMsg,initMsg,initLink,initApp } from './msg'
import { formatTime,clone,scrollToBottom,fileToBlob } from '@/utils/common'


const signalR = require("@microsoft/signalr");
const timeout = [0,1,2,4,10,20,30,40].map(o=>o=o*5000)
const URL_CHAT = `https://pt-prod.lbian.cn/chathub`
const LOGIN  = 0
const LOGOUT = 1

var receiveMsgHub = null
var store = null 



export const initHub =(_store)=>{
  store = _store

  if ((!window.token)||(receiveMsgHub !== null)) return;


  receiveMsgHub = new signalR.HubConnectionBuilder()
    .withUrl(URL_CHAT, { accessTokenFactory: () => window.token })
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect(timeout)
    .build()

  receiveMsgHub.on('ReceiveChatMessage',res => {
    res = JSON.parse(res)
    res.data = JSON.parse(res.data)

    

    switch(res.type) {
      case 60001:                       // 转交
      case 60002:                       // 收回转交
      case 60003: procTrans(res);break; // 退回转交
      default: procHisMsg(res);
    }
  })

  receiveMsgHub.on('UpdateExternalUsers', res => {
    res = JSON.parse(res)
    console.log('update user msg', res)
    procUpateUsr(res)
  })
  receiveMsgHub.on('UpdateRoomMsg', res => {
    console.log('room msg', JSON.parse(res))
    procRoomMsg(JSON.parse(res))
  })
  receiveMsgHub.on('NewExternalUsers',res => {
    console.log('new user msg', JSON.parse(res))
  })

  receiveMsgHub.on('LoginMessage',res => {
    res = JSON.parse(res)
    procLogInOut(res,LOGIN)
    console.log('Login msg', res)
  })
  receiveMsgHub.on('logoutmessage',res => {
    res = JSON.parse(res)
    procLogInOut(res,LOGOUT)
    console.log('Logout msg', res)
  })

  receiveMsgHub.onclose((err) => {
     console.log('连接断开了：', err)
  })
  receiveMsgHub.start().then(res => {
       console.log('消息接收连接成功：', res)
  }).catch(err => {
       console.log('消息接收连接失败：', err)
  })

}


// 虚拟客户经理上下线
const procLogInOut=(msg,type)=>{
  switch(type) {
    case LOGIN: 
      msg.map(o=>{
        let exist = store.userList.filter(o=> o.WxId === msg.wxid)
        if (!exist.length) {
          store.userList.push(o)
        }
      }); 
      break;
    case LOGOUT: 
      store.userList.map((item,i)=>{
        if (item.WxId === msg.wxid) {
          store.userList.splice(i,1)
        }
      })
      break;
  }
}


const procTrans =(msg)=>{
  let { data } = msg

  if (msg.type === 60001) {
    data.Avatar = data.TransferWxIcon
    data.OssAvatar = data.TransferWxIcon
    data.UserName = data.TransferWxName
    data.LastChatTimestamp = msg.timestamp

    if (data.ToUserId === store.user.userId) {
      data.info_t = `${data.FromUserName} => ${data.ToUserName}`
      data.status_t = 2
      data.toMe = true
      store.tranList.push(data)
    }else if (data.FromUserId === store.user.userId) {
      findItem(store.procList, msg.data,'ConversationId',(i,item)=>{
        item.info_t = `${data.FromUserName} => ${data.ToUserName}`
        item.status_t = 1
        item.Id = data.Id
      })
    }
  }else if (msg.type === 60002){
    findItem(store.procList, msg.data,'ConversationId',(i,item)=>{
      item.info_t = ''
      item.status_t = 0
    })
  }else if (msg.type === 60003){
    if (data.ToUserId === store.user.userId) {
      findItem(store.tranList, msg.data,'ConversationId',(i,item)=>{
        store.tranList.splice(i,1)
      })
    }else if (data.FromUserId === store.user.userId) {
      findItem(store.procList, msg.data,'ConversationId',(i,item)=>{
        item.info_t = ''
        item.status_t = 0
      })
    }
    
  }
}


const procRoomMsg=(msg)=>{
  updateMsg(store.roomList, msg)
}

// 更新未读数量、最新回复时间、是否流失
const updateMsg =(list,msg)=>{
  list.map((item,i)=>{
    if (msg.ConversationId === item.ConversationId) {
      item.MarkAsUnread = msg.MarkAsUnread?0:1
      item.UnreadMsgCount = msg.UnreadMsgCount
      item.IsDelete = msg.IsDelete
      item.CurrentReceiptionStatus = msg.CurrentReceiptionStatus
      item.LastChatTimestamp = msg.LastChatTimestamp
    }
  })
}

// 处理实时消息回调
const procUpateUsr = (msg)=>{
  updateMsg(store.contList, msg)
  updateMsg(store.tranList, msg)
}

// 处理实时消息回调
const procHisMsg = (msg)=>{
  console.log('chat msg', msg)
  let _msg
  let _chatHis  = toJS(store.chatHis)
  let _curUser  = toJS(store.curUser)
  let _contList = toJS(store.contList)
  let _procList = toJS(store.procList)
  let _cid = _curUser?.ConversationId
  let cid  = msg?.data?.data?.conversation_id


  switch(msg.data.type) {
    case MSG.iniGrp: break; // 创建群
    case MSG.addUsr: break; // 添加群成员
    case MSG.delUsr: break; // 删除群成员
    case MSG.link:  _msg=initLink(msg,_curUser);break; // 图文链接
    case MSG.app:   _msg=initApp(msg,_curUser);break;  // 小程序
    case MSG.txt:                                      // 文本消息
    case MSG.img:                                      // 图片消息
    case MSG.video:                                    // 视频消息
    case MSG.audio:                                    // 语音消息
    case MSG.file:                                     // 文件消息
    case MSG.gif:   _msg=initMsg(msg,_curUser); break; // 表情消息
    default:        _msg=initMsg(msg,_curUser);
  }
  // console.log('_msg',_msg,msg)

  // 更新聊天记录
  if (cid === _cid) {
    _chatHis.push(_msg)
    store.setChatHis(clone(_chatHis))
    scrollToBottom()
  }
  
  // 更新列表的 LastMsg
  updateLastMsg(_contList,msg)
  updateLastMsg(_procList,msg)
  store.setContList(clone(_contList))
  store.setProcList(clone(_procList))
} 



const findItem =(list,item,key,cb) => {
  list.map((o,i)=>{
    if (o[key] === item[key]) {
      cb(i,o)
    }
  })
}
