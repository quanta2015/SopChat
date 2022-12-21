import React, { Children, cloneElement, useEffect, useRef,useState } from 'react'
import { createPortal } from 'react-dom';
import { getTooltipPosition,isN } from './util'
import './index.less'

/**
 * children: 将 带有提示 的元素
 * pid :父元素
 * position: top, right, bottom, left
 * content: 提示的样式组件
 * trigger: 触发事件 click、mouseenter、contextmenu...
 * closeEvent: 关闭触发事件 click、mouseenter、contextmenu...
 * enterable：鼠标是否能够进入content内,content的mouseenter|mouseleave事件也能控制tooltip的显隐
 * open: 外部传入，能与isVisible一同控制tooltip的显示
 * setOpen: 外部函数指针，能控制open
 * gap: 间距
 * timeout: 关闭tooltip的延迟时间毫秒数
 */
export const Tooltip = ({
    children,
    pid='body',
    position="left",
    content="Text",
    trigger="contextmenu",
    closeEvent="click",
    enterable=false,
    open = false,
    setOpen = ()=>{},
    gap=8,
    timeout=15000,

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

    const showTooltip = async(e,el) =>{
      e.preventDefault();
      await setIsVisible(true)
      setOpen();

      const tooltip = tooltipRef.current
      if(!tooltip) return

      const {left,top} = getTooltipPosition(el,tooltip,document.querySelector(pid),position,gap)
      tooltip.style.left = `${left}px`
      tooltip.style.top = `${top}px`

      if(enterable){
        tooltip.addEventListener('mouseenter',()=>tooltip.enterable=1);
        tooltip.addEventListener('mouseleave',()=>{
          tooltip.enterable=0;
          closeTooltip()
        })
      }
    }

    const closeTooltip = () =>{
      const tooltip = tooltipRef.current

      if(tooltipRef.current && !tooltipRef.current.enterable){
        tooltip.classList.add(`hide`);
        setTimeout(()=>{
          setIsVisible(false)
          tooltip.classList.remove(`hide`);
        },500);
      }
    }

    useEffect(()=>{
      const el = childRef.current 
      if(!el) return;

      const handleTrigger = (e) => {
          showTooltip(e,el)
      }
      const handleCloseEvent = (e) =>{
          setTimeout(()=>closeTooltip(e),0)
      }

      el.addEventListener(trigger,handleTrigger);
      el.addEventListener(closeEvent,handleCloseEvent);

      return () =>{
        el.removeEventListener(trigger,handleTrigger);
        el.removeEventListener(closeEvent,handleCloseEvent);
      }
    },[childRef.current,tooltipRef.current,position,gap])

    useEffect(()=>{
      setIsVisible(open);
    },[open])


    return <>
      {cloneElement(child,{ref:setRef})}

      {isVisible && createPortal(
        <div ref={tooltipRef} className="tooltip">
          <div>{content}</div>
          <span></span>
        </div>,
        document.querySelector(pid)
      )}
    </>
}