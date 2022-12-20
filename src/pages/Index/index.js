import React, { useState, useEffect,useCallback,useRef } from 'react';
import cls from 'classnames';
import { observer, inject, history,connect,userMobxStore } from 'umi';
import { toJS } from 'mobx'
import { Switch,Input,Tabs,message,notification,Button,Modal} from 'antd';
import { formatTime,clone,scrollToBottom,fileToBlob,log,insertMsg,notify } from '@/utils/common'
import { sortListS,sortListG } from '@/utils/procData';
import { Tooltip } from '@/components/Tooltip';
import { QQFace } from '@/components/QQFace';
import RobotSetting  from '@/components/RobotSetting';
import { ChatSide } from '@/components/ChatSide';
import { MSG,RenderMsgDetail,updateLastMsg,initMsg,initLink,initApp } from './msg'
import { initHub,procRoomMsg,procNewUsr,weLogout } from './hub'

import './index.less';
import './msg.less';


import {procSynUsr} from '@/pages/Index/hub'


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
import icon_avatar from '@/imgs/icon-avatar.png'
import icon_robot from '@/imgs/icon-robot.svg'
import icon_stow from '@/imgs/icon-stow.svg'

// icon-stow.svg

const tabList   = ["处理中","群聊","客户"]
const typeList  = ["联系人","群","联系人"]
const KEY_ENTER = 'Enter'
const KEY_BLANK = ''



const Sop = ({ index }) => {
  const store = index;


  const inputEl = useRef(null)

  const [showRobet,setShowRobet] = useState(false)
  const [inputMsg,setInputMsg] = useState("")
  const [collapse,setCollapse] = useState(true) 
  const [showChat,setShowChat] = useState(false) 
  const [showSide,setShowSide] = useState(false)
  const [selTab,setSelTab]     = useState(0)
  const [selWeUsr,setSelWeUsr] = useState(-1) 
  const [selCtUsr,setSelCtUsr] = useState(-1) 
  const [selCtMenu,setSelCtMenu] = useState(-1)
  const [userList,setUserList] = useState([]) 
  const [filter,  setFilter]   = useState('')
  const [curUser, setCurUser]  = useState(null)
  const [pageIndex, setPageIndex]  = useState(1)



  if (!window.token)  {
    history.push('/auth')
  }else {
    useEffect(() => {
      store.getOnlineWxUserList().then((r) => {
        initHub(store)
      });
    }, []);
  }

  // 折叠用户菜单
  const doCollapse =()=>{
    setCollapse(!collapse)
  }


  const doSelTab =(e)=>{
    setSelTab(e)
    setSelWeUsr(-1)
    setShowChat(false)
    setShowSide(false)
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
    });
  }

  // 刷新开启接待用户列表
  const doRefreshProcList =(e)=>{
    store.refreshProcList(e)
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
    sortListG(_contList)
    sortListG(_procList)
    sortListS(s)
    store.setContList(_contList)
    store.setProcList(_procList)
  }

  // 选择聊天对象
  const doSelCtUsr=(item,i)=>{
    setSelCtUsr(i)
    setSelCtMenu(-1)
    setCurUser(item)
    store.setCurUser(item)

    store.getChatInfo(selTab,item).then((r) => {
      setShowChat(true)
      store.setChatHis(clone(r.his))
      store.setChatRel(clone(r.rel))
      scrollToBottom()
    })
    i==selCtMenu? '' : doCloseMenu()
  }

  // 显示更多聊天记录
  const doMoreHistory = ()=>{
    let params = {
      WxId: store.curUser.WxId,
      pageIndex: pageIndex+1,
      chatId: store.curUser.chatId,
      ContactUserId:store.curUser.ContactUserId,
      ConversationId:store.curUser.ConversationId,
      ConversationIds: [store.curUser.ConversationId],
    }

    store.getChatInfo(params,selTab,curUser).then((r) => {
      let _chatHis = toJS(store.chatHis)
      console.log(toJS(r.rel),'rellll')
      setPageIndex(pageIndex+1)
      store.setChatHis(r.his.concat(_chatHis))
      store.setChatRel(clone(r.rel))
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


  const sendFile =async(e)=>{
    if (e.target.files.length > 0) {
      let file = e.target.files[0]
      store.sendFile(file)
    }
  }

  const doSetBot=(e)=>{
    let val = e.currentTarget.checked
    // log(val,'set bot')
    // log(store.curUser.Markasantibot,'set bot')
    store.updateBotSetting(val)
  }


  const doDisEnter =(e)=>{
    // 屏蔽回车事件
    if (e.keyCode == 13) e.preventDefault()
  }

  const doChkInput =(e)=>{
    // 屏蔽回车事件
    if (e.keyCode !== 13) return
    
    if (e.ctrlKey) {
      insertMsg(inputMsg,'\n',inputEl,setInputMsg)
    }else if(inputMsg.length === 0){
      message.info("不能发送空信息")
    }else{
      setInputMsg('')
      store.sendMsg(inputMsg)
    }
    
  }

  // 更新输入数据
  const doChgInput=(e)=>{
    setInputMsg(e.currentTarget.value)
  }

  const doTransReturn=(item,e)=>{
    e.stopPropagation()
    store.transferReturn(item)
  }

  const doTransBack=(item,e)=>{
    e.stopPropagation()
    store.transferBack(item)
  }

  // console.dir(toJS(store.curUser))



  const doOpenNotify=(e)=>{
    // 新加客户
    // let msg = [{
    //     "WxId": "1688854703403498",
    //     "ContactUserId": "7881302266120813",
    //     "ConversationId": "S:1688854703403498_7881302266120813",
    //     "Avatar": "http://wx.qlogo.cn/mmhead/CkBYF6IYNs3zrcRRBDaqspYUCKKw0OwgwsrUl9Z0730icrnXw4ia3lTw/0",
    //     "UserName": "李太白",
    //     "IsDelete": false,
    //     "isOnTop": false,
    //     "MarkAsUnread": false,
    //     "UnreadMsgCount": 0,
    //     "Markasantibot": false,
    //     "CurrentReceiptionStatus": 4,
    // }]
    // procSynUsr(msg)

    // 新加 room
    // let msg = {
    //   "WxId": "1688856848362567",
    //   "ConversationId": "R:wrAIhCKgAAE2A7ISwwVAqdnhnps9e8lg",
    //   "CreateTime": 1671088937,
    //   "CreateUserId": "1688856848362567",
    //   "IsExternal": 1,
    //   "IsManager": 2,
    //   "NickName": "礼拜群",
    //   "Total": 1,
    //   "LeaderId": "1688856848362567",
    //   "chatId": "wrAIhCKgAAE2A7ISwwVAqdnhnps9e8lg",
    //   "CurrentReceiptionStatus": 0,
    //   "LastChatTimestamp": 1671089010812,
    //   "MarkAsUnread": true,
    //   "UnreadMsgCount": 0,
    //   "AntiBot": 0,
    //   "IsRemoved": false,
    //   "CreateOn": "2022-12-15 15:22:19",
    //   "Id": 1506,
    //   "ModifyDatetime": "2022-12-15 15:23:30"
    // }
    // procRoomMsg(msg)

    // 处理列表新加客户
    // let msg = {
    //     "WxId": "1688855187378464",
    //     "Gender": 0,
    //     "CorpId": 0,
    //     "ContactUserId": "7881302637932589",
    //     "ConversationId": "S:1688855187378464_7881302637932589",
    //     "Avatar": "http://wx.qlogo.cn/mmhead/CJ35Z2cnZA3VtFzzwIOlKu8UjcYgiaLiaYHbYOxlGAaTgHIIe2HEbZGw/0",
    //     "OssAvatar": "https://wx-auth.suosihulian.com/chatapi/20220810/f841c52a-6ca1-4878-ba59-732c1bc72df9/bcef02be-9581-4adb-985b-2b126fbce3750",
    //     "NickName": "",
    //     "UserName": "8",
    //     "RealName": "",
    //     "Remark": "",
    //     "Position": "",
    //     "Desc": "",
    //     "IsDelete": false,
    //     "isOnTop": false,
    //     "MarkAsUnread": true,
    //     "UnreadMsgCount": 1,
    //     "Markasantibot": false,
    //     "DeleteTime": "2022-12-15 11:55:03",
    //     "CurrentReceiptionUser": "1522408338939518978",
    //     "CurrentReceiptionStatus": 3,
    //     "LastChatTimestamp": 1671178602467,
    //     "LatestMsg": "{\"data\":{\"at_list\":[],\"content\":\"你好\",\"content_type\":2,\"conversation_id\":\"S:1688855187378464_7881302637932589\",\"is_pc\":0,\"local_id\":\"197\",\"receiver\":\"1688855187378464\",\"send_time\":\"1671178602\",\"sender\":\"7881302637932589\",\"sender_name\":\"8\",\"server_id\":\"1020612\"},\"type\":11041}"
    // }
    // procNewUsr(msg)
    
    // 虚拟客户经理掉线
    // let msg = {
    //   "data": {
    //     "user_id": "1688855187378468"
    //   },
    //   "type": 11027
    // }
    // weLogout(msg)

    setShowRobet(true)

  }

  console.log(showRobet,'showRobet')

  const robotModel = ()=>{
    return (
      <Modal title="Basic Modal" >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    )
  }

  const doDetail =()=>{
    console.log('aaa')
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


  //渲染用户对象
  const RenderItemUser = (item,i,tabIndex)=>(
     <div key={i} className={cls('list-item',{top:!item.isOnTop, sel:selCtUsr===i})} 
        onClick={()=>doSelCtUsr(item,i)}
        onContextMenu={(e)=>doShowMenu(e,i)}
      >
      <div className="item-hd">

        <div className="item-logo">
          {(item.UnreadMsgCount>0) && <i className="uread">{item.UnreadMsgCount}</i> }
          <img src={item?.OssAvatar} />
        </div>
        

        <div className="info">
          <div className="hd">
            <span>{item?.UserName}</span>
            {item?.IsDelete===0 && <span className="card">流失</span> }
            {item?.CurrentReceiptionStatus === 0 && tabIndex === 2 && <span className="card">接待</span> }
            <span>{formatTime(item?.LastChatTimestamp)}</span>
          </div>
          <div className="bd">
            <span>{item?.lastMsg}</span>
          </div>
        </div>
      </div>
      {(item?.status_t === 1) && 
      <div className="item-ft">
        <label>{item?.info_t}</label>
        { (tabIndex === 0) && <span onClick={(e)=>doTransBack(item,e)}> 收回</span>}
      </div>}

      {item?.status_t === 2 && 
      <div className="item-ft">
        <label>{item?.info_t}</label>
        { (tabIndex === 0) && <span onClick={(e)=>doTransReturn(item,e)}> 退回</span>}
      </div>}
    </div>
  )

  // 渲染用户列表
  const RenderItemList = (tabIndex)=>{
    let list = []
    let type = ''
    let tran = store.tranList.filter(o=> o.toMe )
    // let tran = store.tranList
    let tranLen = tran.length

    // console.log('tran',toJS(store.procList))

    switch(tabIndex) {
      case 0: list = doFilter(store.procList,'NickName'); break;
      case 1: list = doFilter(store.roomList,'NickName'); break;
      case 2: list = doFilter(store.contList,'UserName'); break;
    }

    // list.map(o=>{
    //   log(o.MarkAsUnread,'MarkAsUnread')
    //   log(o.UnreadMsgCount,'UnreadMsgCount')
    //   log(o.NickName)
    // })

    console.log('his',toJS(store.chatHis))

    return (
      <div className="contact">
        <div className="search">
          <input placeholder={`搜索${typeList[tabIndex]}`} onKeyUp={doChgFilter} />
          <img src={icon_search} />
        </div>
        <div className="list" onScroll={doCloseMenu}>

          {(tabIndex === 0) && (tran.length>0) && <div className="list-title">转交客户</div>}
          {(tabIndex === 0) && tran.map((item,i)=> RenderItemUser(item,i,tabIndex)) }
          {(tabIndex === 0) && (list.length>0) && <div className="list-title">我的客户</div>}
          {(tabIndex === 0) && list.map((item,i)=> RenderItemUser(item,i+tran.length,tabIndex)) }

          {(tabIndex === 1) && 
          <React.Fragment>
            {list.map((item,i)=>
            <div key={i} className={(selCtUsr===i)?"list-item sel":"list-item"} 
                 onClick={()=>doSelCtUsr(item,i)} >
              <div className="item-hd">
                <div className="item-logo">
                  {(item.MarkAsUnread===0) && <i className="uread"></i> }
                  <img src={icon_user} />
                </div>
                <div className="info">
                  <div className="hd">
                    <span>{item?.NickName}</span>
                    {(item?.IsExternal===1)&&<i>外部</i>}
                    {(item?.IsManager===2)&&<i>群主</i>}
                  </div>
                </div>
              </div>
            </div>)}
          </React.Fragment>}
          
          {tabIndex === 2 &&
            <React.Fragment>
              {list.map((item,i)=>
              <Tooltip  key={i} pid=".list" 
                open={selCtMenu==i}
                position={(i==0 || i==1)? "bottom":"top"} 
                content={topContent(item,tabIndex)}
                setOpen={()=>setSelCtMenu(i)}

                >
                {RenderItemUser(item,i,tabIndex)}
              </Tooltip>)}
            </React.Fragment>}
        </div>
      </div>
    )
  }


  return (
    <div className='g-sop'>
      <div className={collapse?"menu":"menu sm"}>
        
        <div className="title">
          <div className="item" onClick={doCollapse}>
            <img src={icon_stow} />
            <span>折叠</span>
          </div>
          <div className="item">
            <Switch checkedChildren="接待开" unCheckedChildren="接待关" checked={store.conf.robot} onChange={(e)=>doRefreshProcList(e)} style={{width:'70px'}} />
            {/*<span>接待</span>*/}
          </div>
          <div className="item" onClick={doOpenNotify} >
            <img src={icon_robot} />
            <span >机器人</span>
          </div>
          
          
          
        </div>
        {store.userList.map((item,i)=>
          <div className={(selWeUsr===i)?"item sel":"item"} key={i} onClick={()=>doSelWeUsr(i)}>
            <img src={item.OssAvatar} />
            <div className="info">
              <label>{item.UserName}</label>
              <span>{item.CorpName}</span>
            </div>
            {item.LoginType === 2 && <i className="login-type">RPA</i>}
          </div>
        )}
      </div>
      <div className="main">
        
        <div className="wrap">
          <div className="chat-lt">
            <div className="tab">
              {tabList.map((item,i)=> 
                <span key={i} className={(i===selTab)?"sel":""} onClick={()=>doSelTab(i)}>
                  {item}  
                  {(store.unread>0) && (i===2) && <i className="unread">{store.unread}</i>}
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

                    {store.chatRel.more ? 
                      <div className="more act" onClick={doMoreHistory}>更多聊天记录</div>
                      : 
                      <div className="more">暂无更多聊天记录</div>}
                    

                    {store.chatHis.map((item,i)=>
                      <React.Fragment key={i}>
                        {(!item?.sys) &&
                        <div className={(item?.WxId===item?.Msg?.data?.sender)?"msg rec":"msg my"} >
                          <div className="msg-line">

                            <div className="avatar">
                              <img src={item.WeAvatar} />
                            </div>
                            <div className="msg-detail">
                              <div className="msg-info">
                                {item.Msg.data.sender_name || item.UserName} {item.Timestamp}
                              </div>
                              <div className="msg-wrap">
                                {/*{(item.Send_Status === 0) && <div className="msg-status r"><img src={icon_load} /></div>}*/}
                                {(item.Send_Status ===-1) && <div className="msg-status"  ><img src={icon_error} /></div>}
                                
                                {item?.WxId===item?.Msg?.data?.sender && 
                                  <Tooltip 
                                    position='left' 
                                    content={msgContent(list)}
                                    trigger='mouseover' 
                                    closeEvent='mouseleave'
                                    enterable={true}
                                    timeout={300}
                                    >
                                    <i className='msg-menu'>···</i>
                                  </Tooltip>} 
                                {RenderMsgDetail(item.Msg)}
                              </div>
                              {(item.Send_Status === 0) && <i className="msg-status"> 发送中...</i>}
                            </div> 
                          </div>
                        </div>}

                        {(item?.sys) && <div className="sys-msg">{item.inf}</div>}

                      </React.Fragment>
                    )}
                  </div>
                  <div className="sendbox">
                    <div className="send-menu">
                      <div className="menu-item">
                        <QQFace
                          position='top' 
                          pid ='.menu-item'
                          closeEvent='mouseleave'
                          msg = {inputMsg}
                          el = {inputEl}
                          setMsg = {setInputMsg}
                          >
                          <img src={icon_face} />
                        </QQFace>
                      </div>
                      <div className="menu-item">
                        <img src={icon_img} />
                        <input className="upload-img" name="file" accept=".jpg,.jpeg,.png" type="file" value="" onChange={sendFile}/>
                      </div>
                      <div className="menu-item">
                        <img src={icon_file} />
                        <input className="upload-file" name="file" type="file" onChange={sendFile} value=""/>
                      </div>
                      <div className="sp"></div>

                      {(selTab === 2) && 
                      <div className="menu-item">
                        <input 
                          type="checkbox" 
                          checked={store.curUser.Markasantibot === 0?true:false}
                          onChange={doSetBot}
                          />
                        <label> 临时关闭该机器人</label>
                      </div>}

                      {(selTab === 0) && 
                        <div className="menu-item" onClick={()=>store.finishProc()}>
                          <label>处理完成</label>
                        </div> }

                      <div className="menu-item" onClick={()=>setShowSide(!showSide)}>
                        <img src={icon_side} />
                      </div>
                    </div>
                    <div className="send-area">
                      <textarea ref={inputEl} maxLength="1000" autoComplete="off" placeholder="输入聊天内容" value={inputMsg} onKeyDown={doDisEnter} onKeyUp={doChkInput} onChange={doChgInput}></textarea>
                      <span className="el-input__count">{inputMsg.length} / 1000</span>
                    </div>
                    <div className="send-desc"> Enter发送；Ctrl+Enter换行 </div>
                  </div>
                </React.Fragment>}
              </div>

              {showSide && 
              <div className="chat-side">
                
                <ChatSide  tab={selTab} store={store} />
              </div>}
            </div>
          </div>
        </div>
      </div>

      <RobotSetting open={showRobet} closeFn={setShowRobet} store={store}/>

    </div>
  );
};

export default inject('index')(observer(Sop));;
