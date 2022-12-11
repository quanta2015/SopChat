import React, { Children, cloneElement, useEffect, useRef,useState } from 'react'
import { log,insertMsg } from '@/utils/common'


import Client  from '@/components/Client';

import './index.less'


const sList = [{key:0, name:"客户资料"}]
const gList = [{key:0, name:"群资料"}, 
               {key:1, name:"群成员"}]
const cList = [{key:2, name:"话术"}, 
               {key:3, name:"套壳链接"},
               {key:4, name:"机器人"},
               {key:5, name:"sop列表"}]

export const ChatSide = ({
  store,
  tab=0,
}) =>{
    const [key, setKey] = useState(0);
    const [sel, setSel] = useState(0);
    const [sideList,setSideList] = useState((tab===1)?[...gList,...cList]:[...sList,...cList])

    const doSelNav =(e,item)=>{
      setSel(e)
      setKey(item.key)
    }


    return <>
      <div className="chatside-tab">

        <div className="tab-nav">
          {sideList.map((item,i)=>
            <span key={i} 
                  className={(i===sel)?"sel":""} 
                  onClick={()=>doSelNav(i,item)}>
              {item.name}
            </span>
          )}
        </div>
        <div className="tab-bd">
          { (key === 0) && <Client store={store} /> }
          
          
        </div>
      </div>  
    </>
}