import React, { useState, useEffect,useCallback } from 'react';
import cls from 'classnames';
import { observer, inject, history,connect,userMobxStore } from 'umi';
import { toJS } from 'mobx'
import { Switch,Input } from 'antd';
import { formatTime,clone,scrollToBottom } from '@/utils/common'
import { sortList } from '@/utils/procData';
import { Tooltip } from '@/components/Tooltip';
import { RenderMsgDetail } from './msg'
import { initHub,replaceUrl } from './hub'

import './index.less';
import './msg.less';


import icon_wechat from '@/imgs/icon-wechat.png'
import icon_user   from '@/imgs/icon-user.svg'
import icon_edit   from '@/imgs/icon-edit.png'
import icon_search from '@/imgs/icon-search.svg'
import icon_load   from '@/imgs/icon-loading.svg'
import icon_error  from '@/imgs/icon-error.svg'
import icon_face   from '@/imgs/icon-face.png'
import icon_img    from '@/imgs/icon-img.png'
import icon_file   from '@/imgs/icon-file.png'
import icon_side   from '@/imgs/icon-side.svg'

const tabList   = ["处理中","群聊","客户"]
const typeList  = ["联系人","群","联系人"]
const KEY_ENTER = 'Enter'
const KEY_BLANK = ''




const Sop = ({ index }) => {
  const store = index;


  // const [roomList,setRoomList] = useState([]) 
  // const [contList,setContList] = useState([]) 
  // const [procList,setProcList] = useState([])
  // const [chatHis, setChatHis]  = useState([])
  const [collapse,setCollapse] = useState(true) 
  const [showChat,setShowChat] = useState(false) 
  const [showSide,setShowSide] = useState(false)
  const [selTab,setSelTab]     = useState(0)
  const [selWeUsr,setSelWeUsr] = useState(-1) 
  const [selCtUsr,setSelCtUsr] = useState(-1) 
  const [selCtMenu,setSelCtMenu] = useState(-1)
  const [userList,setUserList] = useState([]) 
  const [readList,setReadList] = useState([0,0,0])
  const [filter,  setFilter]   = useState('')
  const [curUser, setCurUser]  = useState(null)
  const [chatInf, setChatInf]  = useState({})
  const [pageIndex, setPageIndex]  = useState(1)


  const updateLastMsg =(list,msg)=> {
    list.map((item,i)=>{
      if (item.ConversationId === msg.data.data.conversation_id) {
        item.msg = msg.data.data
      }
    })
  }

  const initMsg =(msg,usr)=>{
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

  const initLink =(msg,usr)=>{
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

  const initApp =(msg,usr)=>{
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


  const procHisMsg = (msg)=>{
    let _msg
    let _chatHis  = toJS(store.chatHis)
    let _curUser  = toJS(store.curUser)
    let _contList = toJS(store.contList)
    let _procList = toJS(store.procList)
    let _cid = _curUser?.ConversationId
    let cid  = msg.data.data.conversation_id

    switch(msg.data.type) {
      case 11051: break; // 企微账号登录
      case 11074: break; // 创建群
      case 11072: break; // 添加群成员
      case 11073: break; // 删除群成员
      case 11047: _msg=initLink(msg,_curUser);break; // 图文链接
      case 11066: _msg=initApp(msg,_curUser);break;  // 小程序
      case 11041:                                    // 文本消息
      case 11042:                                    // 图片消息
      case 11043:                                    // 视频消息
      case 11044:                                    // 语音消息
      case 11045:                                    // 文件消息
      case 11048: _msg=initMsg(msg,_curUser); break; // 表情消息
      default:    _msg=initMsg(msg,_curUser);
    }
    // console.log('_msg',_msg,msg)

    if (cid === _cid) {
      _chatHis.push(_msg)
      store.setChatHis(clone(_chatHis))
      // setChatHis(clone(_chatHis))
      scrollToBottom()
    }
    
    updateLastMsg(_contList,msg)
    updateLastMsg(_procList,msg)

    store.setContList(clone(_contList))
    store.setProcList(clone(_procList))
    setContList(clone(_contList))
    setProcList(clone(_procList))
  } 

  if (!window.token)  {
    history.push('/auth')
  }else {
    useEffect(() => {
      store.getOnlineWxUserList().then((r) => {
        setReadList(r.read)

        store.setUserList(r.user)
        store.setProcList(r.proc)
        store.setRoomList(r.room)
        store.setContList(r.cont)

        initHub(procHisMsg)
      });
    }, []);
  }


  // 折叠用户菜单
  const doCollapse =()=>{
    setCollapse(!collapse)
  }

  // 选择企微对象
  const doSelWeUsr =(e)=>{
    let WxIds = []
    if (e===selWeUsr) {
      setSelWeUsr(-1)
      store.userList.map((o,i)=>WxIds.push(o.WxId))
    }else{
      setSelWeUsr(e)
      WxIds.push(store.userList[e].WxId)
    }

    store.getDataList(WxIds).then((r) => {
      // console.log(r)
      store.setProcList(r.proc)
      store.setRoomList(r.room)
      store.setContList(r.cont)
      setReadList(r.read)
    });
  }


  const onChange =()=>{

  }


  // 过滤聊天对象
  const doChgFilter=(e)=>{
    let fil = e.currentTarget.value
    if (e.key === KEY_ENTER) {
      setFilter(fil)
    }else if (fil === KEY_BLANK ){
      setFilter('')
    }
  }
  
  
  // 根据关键字过滤查询集合
  const doFilter =(d,key)=>{
    return (filter==='')?d:d.filter((o,i)=>o[key].includes(filter))
  }


  //更改对象数组的value,会改变原数组
  const doChgArrObjValue=(item)=>{
    let arr = (selTab == 0)? store.contList:store.procList
    arr.map((o,j)=>{
      if(o.ConversationId == item.ConversationId) {
        o.isOnTop = item.isOnTop;
      }
    })

    let _contList = toJS(store.contList)
    let _procList = toJS(store.procList)
    sortList(_contList)
    sortList(_procList)
    store.setContList(_contList)
    store.setProcList(_procList)
  }

  // 选择聊天对象
  const doSelCtUsr=(item,i)=>{
    // console.log(item)
    let params = {
      WxId: item.WxId,
      pageIndex: 1,
      ContactUserId:item.ContactUserId,
      ConversationId:item.ConversationId,
      ConversationIds: [item.ConversationId],
    }

    setSelCtUsr(i)
    setSelCtMenu(-1)
    setCurUser(item)
    store.setCurUser(item)

    store.getChatInfo(params,selTab,item).then((r) => {
      // console.log(r.his)
      setChatInf(clone(r.inf))
      setShowChat(true)
      store.setChatHis(clone(r.his))
      scrollToBottom()
    })
    i==selCtMenu? '' : doCloseMenu()
  }

  // 显示更多聊天记录
  const doMoreHistory = ()=>{
    let params = {
      WxId: curUser.WxId,
      pageIndex: pageIndex+1,
      ContactUserId:curUser.ContactUserId,
      ConversationId:curUser.ConversationId,
      ConversationIds: [curUser.ConversationId],
    }
    store.getChatInfo(params,selTab,curUser).then((r) => {
      let _chatHis = toJS(store.chatHis)
      setChatInf(clone(r.inf))
      setPageIndex(pageIndex+1)
      store.setChatHis(r.his.concat(_chatHis))
    })
  }

  // 显示置顶菜单
  const doShowMenu = (e,i) =>{
    e.preventDefault()
    setSelCtMenu(i)
  }

  // 关闭置顶菜单
  const doCloseMenu = () =>{
    setSelCtMenu(-1)
  }


  // 置顶逻辑
  const doTopUsr = async(e,item) =>{
    //阻止item点击事件触发
    e.stopPropagation() 
    await store.setTop(item)
    item.isOnTop = !item.isOnTop;
    doChgArrObjValue(item)
    //关闭弹出框
    doCloseMenu()
  }

  // 置顶对话框
  const topContent = (item,tabIndex) =>{
    return (
      <div className='pop'>
        <h4>请选择你要进行的操作</h4>
        <button onClick={(e)=>doTopUsr(e,item,tabIndex)}>{item.isOnTop? '置顶':'取消置顶'}</button>
      </div>
  )}

  // 聊天记录对话框
  const list = [{content:'撤回',status:1},{content:'保存此小程序',status:0},{content:'转发',status:1}]
  const msgContent = (list)=>{
    return (
      <div className='pop'>
       {list.map((item,i)=>
         <div className={item?.status? "item":"item dis"} key={i}>{item?.content}</div>
       )}
      </div>
    )
  }

  // 渲染用户列表
  const RenderItemList = (tabIndex)=>{
    let list = []
    let type = ''

    switch(tabIndex) {
      case 0: list = doFilter(store.procList,'NickName'); break;
      case 1: list = doFilter(store.roomList,'NickName'); break;
      case 2: list = doFilter(store.contList,'UserName'); break;
    }

    return (
      <div className="contact">
        <div className="search">
          <input placeholder={`搜索${typeList[tabIndex]}`} onKeyUp={doChgFilter} />
          <img src={icon_search} />
        </div>
        <div className="list" onScroll={doCloseMenu}>
          {list.map((item,i)=>
            <React.Fragment key={i}>
              {(tabIndex === 1) && 
              <div className={(selCtUsr===i)?"list-item sel":"list-item"} 
                   onClick={()=>doSelCtUsr(item,i)}
                >
                <img src={icon_user} />
                <div className="info">
                  <div className="hd">
                    <span>{item?.NickName}</span>
                    {(item?.IsExternal===1)&&<i>外部</i>}
                    {(item?.IsManager===2)&&<i>群主</i>}
                  </div>
                </div>
              </div>}

              {((tabIndex === 2)||(tabIndex === 0)) &&
              <Tooltip 
                  pid=".list" 
                  open={selCtMenu==i}
                  position={(i==0 || i==1)? "bottom":"top"} 
                  content={topContent(item,tabIndex)}
                  setOpen={()=>setSelCtMenu(i)}
                >
                <div className={cls('list-item',{top:!item.isOnTop, sel:selCtUsr===i})} 
                    onClick={()=>doSelCtUsr(item,i)}
                    onContextMenu={(e)=>doShowMenu(e,i)}
                  >
                  <img src={item?.OssAvatar} />
                  <div className="info">
                    <div className="hd">
                      <span>{item?.UserName}</span>
                      <span>{item?.send_time}</span>
                    </div>
                    <div className="bd">
                      <span>{item?.msg?.content}</span>
                    </div>
                  </div>
                </div>
              </Tooltip>}
        
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }


  return (
    <div className='g-sop'>
      <div className={collapse?"menu":"menu sm"}>
        <i onClick={doCollapse}></i>
        <div className="title">
          <img src={icon_wechat} />
          <span>企业微信账号({store.userList.length})</span>
        </div>
        {store.userList.map((item,i)=>
          <div className={(selWeUsr===i)?"item sel":"item"} key={i} onClick={()=>doSelWeUsr(i)}>
            <img src={item.OssAvatar} />
            <div className="info">
              <label>{item.UserName}</label>
              <span>{item.CorpName}</span>
            </div>
            {item.LoginType === 2 && <i className="login-type">云机托管</i>}
          </div>
        )}
      </div>
      <div className="main">
        <header>
          <li>开启接待</li>
          <li><Switch defaultChecked onChange={onChange} /></li>
          <li>|</li>
          <li>开启机器人</li>
          <li><img src={icon_edit} /></li>
        </header>
        <div className="wrap">
          <div className="chat-lt">
            <div className="tab">
              {tabList.map((item,i)=> 
                <span key={i} className={(i===selTab)?"sel":""} onClick={()=>setSelTab(i)}>
                  {item}  
                  {(readList[i]>0) && <i className="unread">{readList[i]}</i>}
                </span>
              )}
            </div>
            {RenderItemList(selTab)}
          </div>

          <div className="chat-cnt">

            {curUser &&
            <div className="chat-hd">
              <div className="info">
                <span className="userinfo">{curUser.UserName}</span>
                <span className="from">@微信</span>
                {(curUser.IsDelete === 0) && <span className="del">已流失</span>}
              </div>
              <div className="comp">{curUser.WeUserName} - {curUser.CorpName}</div>
            </div>}

            <div className="chat-bd">

              <div className="chat-wrap">
                {showChat && 
                <React.Fragment>
                  <div className="chat-content" id="chatContent">

                    {chatInf.more ? 
                      <div className="more act" onClick={doMoreHistory}>更多聊天记录</div>
                      : 
                      <div className="more">暂无更多聊天记录</div>}
                    

                    {store.chatHis.map((item,i)=>
                      <div className={(item.WxId===item.Msg.data.sender)?"msg rec":"msg my"} key={i}>
                        <div className="msg-line">

                          <div className="avatar">
                            <img src={item.WeAvatar} />
                            
                          </div>
                          <div className="msg-detail">
                            <div className="msg-info">
                              {item.Msg.data.sender_name || item.UserName} {item.Timestamp}
                            </div>
                            <div className="msg-wrap">
                              {(item.Send_Status === 0) && <div className="msg-status r"><img src={icon_load} /></div>}
                              {(item.Send_Status ===-1) && <div className="msg-status"  ><img src={icon_error} /></div>}
                              
                              {item.WxId===item.Msg.data.sender && 
                                <Tooltip 
                                  position='left' 
                                  content={msgContent(list)}
                                  trigger='click' 
                                  closeEvent='mouseleave'
                                  enterable={true}
                                  timeout={300}
                                  >
                                  <i className='msg-menu'>···</i>
                                </Tooltip>} 
                              {RenderMsgDetail(item.Msg)}
                            </div>
                          </div> 
                        </div>
                      </div>

                    )}
                  </div>
                  <div className="sendbox">
                    <div className="send-menu">
                      <div className="menu-item">
                        <img src={icon_face} />
                      </div>
                      <div className="menu-item">
                        <img src={icon_img} />
                        <input className="el-upload__input" name="file" accept=".jpg,.jpeg,.png" type="file" />
                      </div>
                      <div className="menu-item">
                        <img src={icon_file} />
                        <input className="el-upload__input" name="file" accept="" type="file" />
                      </div>
                      <div className="sp"></div>
                      <div className="menu-item">
                        <input id="closeRobot" type="checkbox" />
                        <label> 临时关闭该机器人</label>
                        <span className="finish">处理完成</span>
                      </div>
                      <div className="menu-item" onClick={()=>setShowSide(!showSide)}>
                        <img src={icon_side} />
                      </div>
                    </div>
                    <div className="send-area">
                      <textarea maxLength="1000" autoComplete="off" placeholder="输入聊天内容"></textarea>
                      <span className="el-input__count">0 / 1000</span>
                    </div>
                    <div className="send-desc"> Enter发送；Ctrl+Enter换行 </div>
                  </div>
                </React.Fragment>}
              </div>

              {showSide && 
              <div className="chat-side"></div>}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default inject('index')(observer(Sop));;
