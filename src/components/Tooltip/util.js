const getTooltipPosition = (el,tooltip,prt,position,gap) =>{
    const { top: elTop, left: elLeft, height: elHeight, width:  elWidth } = el.getBoundingClientRect();
    const { width: tooltipWidth, height: tooltipHeight } = tooltip.getBoundingClientRect();
    const { top: prtTop, left: prtLeft } = prt.getBoundingClientRect();

    let correctedLeft = elLeft - (prt.tagName=='BODY'? 0:prtLeft) + prt.scrollLeft;
    let correctedTop = elTop - (prt.tagName=='BODY'? 0:prtTop) + prt.scrollTop;

    switch (position) {
      case 'top': {
         // correctedLeft = correctedLeft + elWidth / 2 -  tooltipWidth / 2;
         correctedTop = correctedTop - gap - tooltipHeight;
         break;
      }
      case 'left': {
         correctedLeft = elLeft - gap - tooltipWidth;
         correctedTop = correctedTop + elHeight / 2 - tooltipHeight / 2;
         break;
      }
      case 'right': {
         correctedLeft = correctedLeft + elWidth + gap;
         correctedTop = correctedTop + elHeight / 2 - tooltipHeight / 2;
         break;
      }
      case 'bottom':
      default:
         correctedLeft = correctedLeft + elWidth / 2 - tooltipWidth / 2;
         correctedTop = correctedTop + elHeight + gap;
   }

   tooltip.classList.add(`tooltip_${position}`);
   return {
      left: correctedLeft,
      top: correctedTop,
   };
}

const isN=(e)=>{
   return  ((e===null)||(e==='')||(e===undefined))?true:false
}



export {getTooltipPosition,isN}