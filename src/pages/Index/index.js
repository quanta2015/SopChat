import React, { useState, useEffect } from 'react';
import { observer, inject, history,connect } from 'umi';
import { Switch,Input } from 'antd';

import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar' 
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn') 
dayjs.extend(calendar)
dayjs.extend(relativeTime)

// dayjs().calendar(null, {
//   sameDay: 'h:mm A', // The same day ( Today at 2:30 AM )
//   nextDay: '[Tomorrow]', // The next day ( Tomorrow at 2:30 AM )
//   nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
//   lastDay: '[Yesterday]', // The day before ( Yesterday at 2:30 AM )
//   lastWeek: '[Last] dddd', // Last week ( Last Monday at 2:30 AM )
//   sameElse: 'DD/MM/YYYY' // Everything else ( 7/10/2011 )
// })


console.log('lang',dayjs.locale())



import './index.less';

import icon_wechat from '@/imgs/icon-wechat.png'
import icon_user   from '@/imgs/icon-user.svg'
import icon_edit   from '@/imgs/icon-edit.png'
import icon_search from '@/imgs/icon-search.svg'

const tabList   = ["处理中","群聊","客户"]
const typeList  = ["联系人","群","联系人"]
const KEY_ENTER = 'Enter'
const KEY_BLANK = ''

import { getContactTopList,getCancelContactTopRequest } from '@/services/api';
import { sortList } from '@/utils/procData';

const Sop = ({ index }) => {
  const store = index;

  const [show,setShow] = useState(true) 
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


  useEffect(() => {
    store.getOnlineWxUserList().then((r) => {
      setUserList(r.user)
      setProcList(r.proc)
      setRoomList(r.room)
      setContList(r.cont)
      setReadList(r.read)
    });
  }, []);


  // 折叠用户菜单
  const doCollapse =()=>{
    setShow(!show)
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

  

  const doSelTab=(e)=>{
    console.log(e)
    
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
  const doChgArrObjValue=(arr,equalKey,equalV,key,newV)=>{
    arr.map((o,j)=>{
        if(o[equalKey]==equalV) {
          o[key]=newV;
        }
    })
  }

  const doSelCtUsr=(item,i)=>{
    console.log(i,item)
    setSelCtUsr(i)
    i==selCtMenu? '' : doCloseMenu()
  }

  console.log('userList',userList);

  const doShowMenu = (e,i) =>{
    e.preventDefault()
    setSelCtMenu(i)
  }

  const doCloseMenu = () =>{
    setSelCtMenu(-1)
  }

  const doTopUsr = async(e,item,tab) =>{
    //阻止item点击事件触发
    e.stopPropagation() 
    let newIsOntTop = (item.isOnTop)? 0:1; 
    let params = { 
      WxId: `${item.WxId}`,
      ContactUserId: `${item.ContactUserId}`
    }
    newIsOntTop? 
      await getCancelContactTopRequest(params):
      await getContactTopList(params)
    //更新处理中列表以及客户列表中的item.isOntTop值
    item.isOnTop = newIsOntTop
    tab==0? doChgArrObjValue(contList,"ConversationId",item.ConversationId,"isOnTop",newIsOntTop):
            doChgArrObjValue(procList,"ConversationId",item.ConversationId,"isOnTop",newIsOntTop)
    //更新list排序
    sortList(contList)
    sortList(procList)
    //关闭弹出框
    doCloseMenu()
  }

  // 渲染用户列表
  const RenderItemList = (tabIndex)=>{
    let list = []
    let type = ''

    switch(tabIndex) {
      case 0: list = procList; break;
      case 1: list = doFilter(roomList,'NickName'); break;
      case 2: list = contList; break;
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
              <div className={(selCtUsr===i)?"list-item sel":"list-item"} onClick={()=>doSelCtUsr(item,i)}>
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
              <div className={(item.isOnTop)? "list-item":"list-item top"} onClick={()=>doSelCtUsr(item,i)} 
                  onContextMenu={(e)=>doShowMenu(e,i)}>
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
                { (selCtMenu == i) &&  
                  <div className='pop'>
                    <div>
                      <h4>请选择你要进行的操作</h4>
                      <button onClick={(e)=>doTopUsr(e,item,tabIndex)}>{item.isOnTop? '置顶':'取消置顶'}</button>
                    </div>
                    <span></span>
                  </div>
                }
              </div>}

            </React.Fragment>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='g-sop'>
      <div className={show?"menu":"menu sm"}>
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
            
          </div>
        </div>
      </div>

    </div>
  );
};

export default inject('index')(observer(Sop));;
