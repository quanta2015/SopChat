import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar' 
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn') 
dayjs.extend(calendar)
dayjs.extend(relativeTime)


const rTime = (t)=> {return dayjs().to(dayjs.unix(parseInt(t)))}


const formatMsg =(list)=>{
  list.map((item,i)=>{
    item.msg = JSON.parse(item?.LatestMsg)?.data;
    item.send_time = item?.msg?.send_time? rTime(item?.msg?.send_time):'';
  })
}

const initUnRead =(r,list)=>{
  list.map((o,i)=>{
    let count = 0
    o.map((p,j)=>{
      if (p.UnreadMsgCount) count++
    })
    r[i] = count
  })
}

export const procData = (s,t,u,read)=>{
  formatMsg(t)
  formatMsg(u)
  initUnRead(read, [s,t,u])
}