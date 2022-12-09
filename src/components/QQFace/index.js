import React, { Children, cloneElement, useEffect, useRef,useState } from 'react'
import { createPortal } from 'react-dom';
import { faceList } from './util'
import { log,insertMsg } from '@/utils/common'

import './index.less'

export const QQFace = ({
    children,
    pid='body',
    trigger="click",
    enterable=false,
    msg,
    el,
    setMsg = ()=>{}
}) =>{
    const child = Children.only(children)
    const childRef = useRef()
    const tooltipRef = useRef();
    const [isVisible, setIsVisible] = useState(false);

    const setRef = (el) =>{
      childRef.current = el
      const {ref} = child
      if(ref){
        ref.current = el 
      }
    }

    // 显示表情列表
    const showTooltip = async(e,el) =>{
      e.preventDefault();
      await setIsVisible(true)
      
      const tooltip = tooltipRef.current
      if(!tooltip) return

      tooltip.style.left = `0px`
      tooltip.style.top = `-224px`

      if(enterable){
        tooltip.addEventListener('mouseenter',()=>tooltip.enterable=1);
      }
    }

    // 关闭表情列表
    const closeTooltip = () =>{
      if(tooltipRef.current && !tooltipRef.current.enterable){
        setTimeout(()=>setIsVisible(false),50);
      }
    }

    // 插入选择的表情数据
    const doSelFace=(item)=>{
      insertMsg(msg,item,el,setMsg)
      setIsVisible(false)
    }


    useEffect(()=>{
      const el = childRef.current 
      if(!el) return;

      const handleTrigger = (e) => {
        showTooltip(e,el)
      }
      const handleCloseEvent = (e) =>{
        setTimeout(()=>closeTooltip(e),50)
      }

      // 点击表情事件处理
      el.addEventListener(trigger,handleTrigger);
      return () =>{
        el.removeEventListener(trigger,handleTrigger);
      }
    },[childRef.current,tooltipRef.current])


    // 外部点击关闭表情列表
    const handleClickOutside = e => {
      if (!isVisible) return 
      if (!tooltipRef.current.contains(e.target)) {
        setIsVisible(false)
      }
    };  

    // 外部点击事件处理
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    return <>
      {cloneElement(child,{ref:setRef})}

      {isVisible && createPortal(
        <div ref={tooltipRef} className="qqface" >
          {faceList.map((item,i)=>
            <div className="item" key={i}
              style={{backgroundPosition: `${-(i%15)*29}px ${-(Math.floor(i/15))*29}px`}}
              onClick={()=>doSelFace(item)}></div>
          )}
        </div>,
        document.querySelector(pid)
      )}
    </>
}