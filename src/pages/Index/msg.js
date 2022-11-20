export const MSG = {
  proc:  0,
  group: 1, 
  user:  2,
  len:   16,
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



const RenderTxt   =(msg)=> <span  className="mg-txt">{msg.content}</span>
const RenderImg   =(msg)=> <span  className="mg-img"><img src={msg.file_path} /></span>
const RenderGif   =(msg)=> <span  className="mg-gif"><img src={msg.file_path} /></span>
const RenderVideo =(msg)=> <video className="mg-mp4" src={msg.file_path} muted controls preload="true" />
const RenderAudio =(msg)=> <audio className="mg-mp3" src={msg.file_path} muted controls preload="true" />
const RenderFile  =(msg)=> <span  className="mg-file" src={msg.file_path} >文件:{msg.content}</span>

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