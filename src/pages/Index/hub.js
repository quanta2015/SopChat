const signalR = require("@microsoft/signalr");
const URL_CHAT = `https://pt-prod.lbian.cn/chathub`

var receiveMsgHub = null

const ossUrlList = ["https://smkgl-privateoss.oss-cn-hangzhou.aliyuncs.com", 
           "https://smkgl-privateoss.oss-cn-hangzhou-internal.aliyuncs.com",
           "https://rhyy-oss.96225.com"]

export const replaceUrl =(url)=>{
  if(!url) {
    return ''
  }
  let newUrl = url;
  if(window.location.href.indexOf(serve.ipHost) > -1) {
    ossUrlList.forEach(item => {
      newUrl = url.replace(item, serve.ipUrlForReplace)
    })
  }
  return newUrl;
}


export const initHub =(cb1,cb2,cb3,cb4)=>{

  if ((!window.token)||(receiveMsgHub !== null)) return;



  receiveMsgHub = new signalR.HubConnectionBuilder()
    .withUrl(URL_CHAT, { accessTokenFactory: () => window.token })
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect([0, 5000, 10000, 20000, 50000, 100000, 150000, 200000])
    .build()

  receiveMsgHub.on('ReceiveChatMessage',res => {
    res = JSON.parse(res)
    res.data = JSON.parse(res.data)
    cb1(res)
    // console.log('chat msg', res)
  })

  receiveMsgHub.on('UpdateExternalUsers', res => {
    console.log('update user msg', JSON.parse(res))
  })
  receiveMsgHub.on('UpdateRoomMsg', res => {
    console.log('room msg', JSON.parse(res))
  })
  receiveMsgHub.on('NewExternalUsers',res => {
    console.log('new user msg', JSON.parse(res))
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

// export const initHub =(cb1,cb2,cb3,cb4)=>{

//   if ((!window.token)||(receiveMsgHub !== null)) return;


//   console.log('cb1',cb1)

//   receiveMsgHub = new signalR.HubConnectionBuilder()
//     .withUrl(URL_CHAT, { accessTokenFactory: () => window.token })
//     .configureLogging(signalR.LogLevel.Information)
//     .withAutomaticReconnect([0, 5000, 10000, 20000, 50000, 100000, 150000, 200000])
//     .build()

//   receiveMsgHub.on('ReceiveChatMessage',res => {
//     res = JSON.parse(res)
//     res.data = JSON.parse(res.data)
//     cb1(res)
//     // console.log('chat msg', res)
//   })

//   receiveMsgHub.on('UpdateExternalUsers', res => {
//     console.log('update user msg', JSON.parse(res))
//   })
//   receiveMsgHub.on('UpdateRoomMsg', res => {
//     console.log('room msg', JSON.parse(res))
//   })
//   receiveMsgHub.on('NewExternalUsers',res => {
//     console.log('new user msg', JSON.parse(res))
//   })


//   receiveMsgHub.onclose((err) => {
//      console.log('连接断开了：', err)
//   })
//   receiveMsgHub.start().then(res => {
//        console.log('消息接收连接成功：', res)
//   }).catch(err => {
//        console.log('消息接收连接失败：', err)
//   })

// }



