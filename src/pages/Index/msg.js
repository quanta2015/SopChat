import { clone } from '@/utils/common'
import { faceList,faceMap } from '@/components/QQFace/util'

import '@/components/QQFace/index.less'

export const MSG = {
  proc:  0,
  group: 1, 
  user:  2,
  len:   16,
  err_logout: 11027,
  login: 11051,
  iniGrp:11074,
  addUsr:11072,
  delUsr:11073,
  txt:   11041, 
  img:   11042, 
  video: 11043, 
  audio: 11044, 
  file:  11045,
  link:  11047, 
  gif:   11048,
  app:   11066, 
  mem:   11072,
}


const extractName = (e)=>{
  let list = e.split('/')
  return list[list.length-1]
}


export const updateLastMsg =(list,msg)=> {
  list.map((item,i)=>{
    if (item.ConversationId === msg.data.data.conversation_id) {
      item.msg = clone(msg.data.data)
      switch(msg.data.type) {
        case MSG.img: item.lastMsg = "【图片】";break;
        case MSG.file: item.lastMsg = "【文件】";break;
      }
    }
  })
}

export const initMsg =(msg,usr)=>{
  const { data, wxid, ...oth } = msg
  const _data = data.data
  const ret = { 
    id: _data.sender,
    WxId: wxid,
    type: data.type,
    msgId: msg.msgId,
    sendTime: _data.send_time,
    hitNode: _data.hit_node || '',
    sendStatus: msg.Send_Status,
    name: msg.UserName == 'api' || !msg.UserName ? _data.sender_name : msg.UserName,
    content: _data.content || replaceUrl(_data.file_path) || replaceUrl(_data.url),
    WeAvatar: (msg.wxid===_data.sender)?usr?.WeAvatar:usr?.Avatar,
    Msg: data,  
    ...oth 
  }
  return ret
}

export const initLink =(msg,usr)=>{
  const { data } = msg
  let _msg = initMsg(msg,usr)
  _msg = {
    url: data.data.url,
    desc: data.data.desc,
    title: data.data.title,
    image_url: replaceUrl(data.data.image_url),
    ..._msg
  }
}

export const initApp =(msg,usr)=>{
  const { data } = msg
  let _msg = initMsg(msg,usr)
  _msg = {
    ghid: data.data.ghid,
    title: data.data.title,
    headImg: data.data.headimg,
    programName: msg.data.name,
    serverId: data.data.server_id,
    internalPath: data.data.internalPath,
    enterPoint: data.data.enterpoint,
    image_key1: data.data.image_key1,
    image_key2: data.data.image_key2,
    image_key3: data.data.image_key3,
    image_size: data.data.image_size,
    ..._msg
  }
}

// 将文字表情替换成图标
const formatTxtMsg=(msg)=> {
  const list = msg?.match(/\[([\u4e00-\u9fa5]|[A-Z]){1,3}\]/g);
  list && list.forEach(item => {
    let index = faceList.findIndex(e=> e === item)
    let faceItem = `<div class='qqface-item' title=${item} style='background-position: ${-(index%15)*29}px ${-(Math.floor(index/15))*29}px' \></div>`
    msg = msg.replace(item, faceItem);
  })
  return msg
}


const RenderTxt   =(msg)=> <span  className="mg-txt" dangerouslySetInnerHTML={{ __html:formatTxtMsg(msg.content) }}></span>
const RenderImg   =(msg)=> <span  className="mg-img"><img src={msg.file_path} /></span>
const RenderGif   =(msg)=> <span  className="mg-gif"><img src={msg.file_path} /></span>
const RenderVideo =(msg)=> <video className="mg-mp4" src={msg.file_path} muted controls preload="true" />
const RenderAudio =(msg)=> <audio className="mg-mp3" src={msg.file_path} muted controls preload="true" />
const RenderFile  =(msg)=> <span  className="mg-txt"  target="_blank"><a className="mg-file" href={msg.file_path}>文件:{extractName(msg.file_path)}</a></span>



const RenderApp =(msg)=> (
  <div className="mg-app">
    <div className="info">
      <img src={msg.internalPath} alt={msg.programName} />
      <span className="name one-txt-cut">{msg.programName}</span>
    </div>
    <div className="content">{msg.title}</div>
    <div className="mark">小程序</div>
  </div>
)

const RenderCard=(msg)=>(
  <a className="mg-card" href={msg.url} target="_blank">
    <span className="link-title">{msg.title || ''}</span>
    <span className="link-bd">
      <span className="desc">{msg.desc}</span>
      <span className="pic">
        <img src={msg.image_url} />
      </span>
    </span>
  </a>
)

export const RenderMsgDetail = (msg)=>{
  switch(msg.type) {
    case MSG.txt:  return RenderTxt(msg.data);
    case MSG.app:  return RenderApp(msg.data);
    case MSG.img:  return RenderImg(msg.data);
    case MSG.gif:  return RenderGif(msg.data);
    case MSG.link: return RenderCard(msg.data);
    case MSG.file: return RenderFile(msg.data);
    case MSG.video:return RenderVideo(msg.data);
    case MSG.audio:return RenderAudio(msg.data);
  }
}

const ossUrlList = ["https://smkgl-privateoss.oss-cn-hangzhou.aliyuncs.com", 
           "https://smkgl-privateoss.oss-cn-hangzhou-internal.aliyuncs.com",
           "https://rhyy-oss.96225.com"]
const realIp = "http://10.101.251.167/rhyysshl/oss"

export const replaceUrl =(url)=>{
  if(!url) {
    return ''
  }
  let newUrl = url;
  ossUrlList.forEach(item => {
    newUrl = url.replace(item, realIp)
  })
  return newUrl;
}