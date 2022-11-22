import React, { useState, useEffect } from 'react';
import cls from 'classnames';
import { observer, inject, history,connect } from 'umi';
import { Switch,Input } from 'antd';
import { formatTime,clone } from '@/utils/common'
import { Tooltip } from '@/components/Tooltip';
import { RenderMsgDetail } from './msg'

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

import { sortList } from '@/utils/procData';





const Sop = ({ index }) => {
  const store = index;

  const [collapse,setCollapse] = useState(true) 
  const [showChat,setShowChat] = useState(false) 
  const [showSide,setShowSide] = useState(false)

  const [selTab,setSelTab]     = useState(0)
  const [selWeUsr,setSelWeUsr] = useState(-1) 
  const [selCtUsr,setSelCtUsr] = useState(-1) 
  const [selCtMenu,setSelCtMenu] = useState(-1)
  const [userList,setUserList] = useState([]) 
  const [roomList,setRoomList] = useState([]) 
  const [contList,setContList] = useState([]) 
  const [procList,setProcList] = useState([])
  const [readList,setReadList] = useState([0,0,0])
  const [filter,  setFilter]   = useState('')
  const [curUser, setCurUser]  = useState(null)
  const [chatHis, setChatHis]  = useState([])
  const [chatInf, setChatInf]  = useState({})
  const [pageIndex, setPageIndex]  = useState(1)


  if (!window.token)  {
    history.push('/auth')
  }else {
    useEffect(() => {
      store.getOnlineWxUserList().then((r) => {
        setUserList(r.user)
        setProcList(r.proc)
        setRoomList(r.room)
        setContList(r.cont)
        setReadList(r.read)
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
      userList.map((o,i)=>WxIds.push(o.WxId))
    }else{
      setSelWeUsr(e)
      WxIds.push(userList[e].WxId)
    }

    store.getDataList(WxIds).then((r) => {
      console.log(r)
      setProcList(r.proc)
      setRoomList(r.room)
      setContList(r.cont)
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
    let arr = (selTab == 0)? contList:procList
    arr.map((o,j)=>{
      if(o.ConversationId == item.ConversationId) {
        o.isOnTop = item.isOnTop;
      }
    })
    sortList(contList)
    sortList(procList)
  }

  // 选择聊天对象
  const doSelCtUsr=(item,i)=>{
    console.log(item)
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

    store.getChatInfo(params,selTab,item).then((r) => {
      console.log(r)
      setChatHis(clone(r.his))
      setChatInf(clone(r.inf))
      setShowChat(true)
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
      setChatHis(r.his.concat(chatHis))
      setChatInf(clone(r.inf))
      setPageIndex(pageIndex+1)
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
  const content = (item,tabIndex) =>{
    return (
      <div className='pop'>
        <h4>请选择你要进行的操作</h4>
        <button onClick={(e)=>doTopUsr(e,item,tabIndex)}>{item.isOnTop? '置顶':'取消置顶'}</button>
      </div>
  )}

  // 渲染用户列表
  const RenderItemList = (tabIndex)=>{
    let list = []
    let type = ''

    switch(tabIndex) {
      case 0: list = doFilter(procList,'NickName'); break;
      case 1: list = doFilter(roomList,'NickName'); break;
      case 2: list = doFilter(contList,'UserName'); break;
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
                  content={content(item,tabIndex)}
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
          <span>企业微信账号({userList.length})</span>
        </div>
        {userList.map((item,i)=>
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
                  <div className="chat-content">

                    {chatInf.more ? 
                      <div className="more act" onClick={doMoreHistory}>更多聊天记录</div>
                      : 
                      <div className="more">暂无更多聊天记录</div>}
                    

                    {chatHis.map((item,i)=>
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
                        <input class="el-upload__input" name="file" accept=".jpg,.jpeg,.png" type="file" />
                      </div>
                      <div className="menu-item">
                        <img src={icon_file} />
                        <input class="el-upload__input" name="file" accept="" type="file" />
                      </div>
                      <div className="sp"></div>
                      <div className="menu-item">
                        <input id="closeRobot" type="checkbox" />
                        <label for="closeRobot"> 临时关闭该机器人</label>
                        <span class="finish">处理完成</span>
                      </div>
                      <div className="menu-item" onClick={()=>setShowSide(!showSide)}>
                        <img src={icon_side} />
                      </div>
                    </div>
                    <div className="send-area">
                      <textarea maxlength="1000" autocomplete="off" placeholder="输入聊天内容"></textarea>
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
