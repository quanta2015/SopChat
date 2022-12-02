const signalR = require("@microsoft/signalr");
const timeout = [0,1,2,4,10,20,30,40].map(o=>o=o*5000)
const URL_CHAT = `https://pt-prod.lbian.cn/chathub`


var receiveMsgHub = null


export const initHub =(cb1,cb2,cb3,cb4)=>{

  if ((!window.token)||(receiveMsgHub !== null)) return;


  receiveMsgHub = new signalR.HubConnectionBuilder()
    .withUrl(URL_CHAT, { accessTokenFactory: () => window.token })
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect(timeout)
    .build()

  receiveMsgHub.on('ReceiveChatMessage',res => {
    res = JSON.parse(res)
    res.data = JSON.parse(res.data)
    cb1(res)
    console.log('chat msg', res)
  })

  receiveMsgHub.on('UpdateExternalUsers', res => {
    console.log('update user msg', JSON.parse(res))
    cb2(res)
  })
  receiveMsgHub.on('UpdateRoomMsg', res => {
    console.log('room msg', JSON.parse(res))
    cb3(res)
  })
  receiveMsgHub.on('NewExternalUsers',res => {
    console.log('new user msg', JSON.parse(res))
    cb4(res)
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