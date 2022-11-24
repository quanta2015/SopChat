import React, { Children, cloneElement, useEffect, useRef,useState } from 'react'
import { createPortal } from 'react-dom';
import { getTooltipPosition,isN } from './util'
import './index.css'

/**
 * children: 将 带有提示 的元素
 * position: top, right, bottom, left
 * gap: 间距
 * content: 提示的样式组件
 * pid :父元素
 * trigger: 触发事件 click、mouseenter、contextmenu...
 * closeEvent: 关闭触发事件 click、mouseenter、contextmenu...
 * timeout: 关闭tooltip的延迟时间毫秒数
 * enterable：鼠标是否能够进入content内,content的mouseenter|mouseleave事件也能控制tooltip的显隐
 * open: 外部一同控制
 * setOpen: 控制open
 */
export const Tooltip = ({
    children,
    position="top",
    gap=5,
    content="Text",
    trigger="contextmenu",
    closeEvent="click",
    pid='body',
    timeout=0,
    enterable=false,
    open = false,
    setOpen = ()=>{}
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
        if(tooltipRef.current && !tooltipRef.current.enterable){
            setTimeout(()=>setIsVisible(false),timeout);
        }
    }

    useEffect(()=>{
        const el = childRef.current 
        if(!el) return;

        el.addEventListener(trigger,e=>showTooltip(e,el));
        el.addEventListener(closeEvent,()=>setTimeout(()=>closeTooltip(),0));

        return () =>{
            el.removeEventListener(trigger,e=>showTooltip(e,el));
            el.removeEventListener(closeEvent,()=>setTimeout(()=>closeTooltip()));
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