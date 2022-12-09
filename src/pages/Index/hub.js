import { toJS } from 'mobx'
import { MSG,RenderMsgDetail,updateLastMsg,initMsg,initLink,initApp } from './msg'
import { formatTime,clone,scrollToBottom,fileToBlob } from '@/utils/common'


const signalR = require("@microsoft/signalr");
const timeout = [0,1,2,4,10,20,30,40].map(o=>o=o*5000)
const URL_CHAT = `https://pt-prod.lbian.cn/chathub`


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
    console.log('chat msg', res)

    switch(res.type) {
      case 60001:                    // 转交
      case 60002:                    // 收回转交
      case 60003: procTrans();break; // 退回转交
      default: procHisMsg(res);
    }
  })

  receiveMsgHub.on('UpdateExternalUsers', res => {
    console.log('update user msg', JSON.parse(res))
    procUpateUsr(res)
    // cb2(res)
  })
  receiveMsgHub.on('UpdateRoomMsg', res => {
    console.log('room msg', JSON.parse(res))
    // cb3(res)
  })
  receiveMsgHub.on('NewExternalUsers',res => {
    console.log('new user msg', JSON.parse(res))
    // cb4(res)
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


const procTrans =(msg)=>{
  
}

// 处理实时消息回调
const procUpateUsr = (msg)=>{


}

// 处理实时消息回调
const procHisMsg = (msg)=>{
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
