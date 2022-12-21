import React, { Children, cloneElement, useEffect, useRef,useState } from 'react'
import { toJS } from 'mobx'
import { observer, inject, history,connect,userMobxStore } from 'umi';
import { createPortal } from 'react-dom';
import { Checkbox, Divider } from 'antd';
import { formatTime,clone,scrollToBottom,fileToBlob,log,insertMsg,notify } from '@/utils/common'

import './index.less'


const RobotSetting = ({
    children,
    open = false,
    closeFn ,
    store,
    setOpen = ()=>{},
}) =>{
  const tooltipRef = useRef();

  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    caluCheckStatus()
  }, [store.userList]);

  const caluCheckStatus = ()=>{
    let len = store.userList.reduce((p,c) => p+c.IsBotOn,0) 
    setIndeterminate( len!== store.userList.length && len !== 0 );
    setCheckAll(len === 0)
  }

  const onChangeAll = (e) => {
    let list = []
    store.userList.map(item=>{
      item.IsBotOn = e.target.checked ?0:1
      list.push(item.WxId)
    })
    setIndeterminate(false);
    setCheckAll(e.target.checked);

    updateBotConf(list,e.target.checked)
  };

  const onChange = (item,i,e) => {
    item.IsBotOn = e.target.checked ? 0:1
    caluCheckStatus()
    updateBotConf([item.WxId],e.target.checked)
  }

  const updateBotConf =(list,checked)=>{
    let params ={
      wxid: list,
      turnon: checked?'true':'false'
    }
    store.updateBotConf(params)
  }
    
  const doClose =(e)=>{
    closeFn(false)
  }

  return <>

    {open && createPortal(
      <div ref={tooltipRef} className="g-robset" onClick={doClose}>
        <div className="dialog" onClick={e=> e.stopPropagation()}>
          <div className="hd"> 机器人设置</div>

          <div className="bd">
            <div className="row">
              <Checkbox indeterminate={indeterminate} onChange={onChangeAll} checked={checkAll}>企业微信账号</Checkbox>
              <span>机器人状态</span>
            </div>
            {store.userList.map((item,i)=>
              <div className="row" key={i}>
                <Checkbox onChange={(e)=>onChange(item,i,e)} checked={!item.IsBotOn}>{item.UserName}</Checkbox>
                <span>{!item.IsBotOn?'打开':'关闭'}</span>
              </div>
            )}
          </div>    
        </div>
      </div>,
      document.querySelector('body')
    )}
  </>
}


export default observer(RobotSetting)