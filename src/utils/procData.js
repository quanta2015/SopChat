import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar' 
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn') 
dayjs.extend(calendar)
dayjs.extend(relativeTime)


const rTime = (t)=> {return dayjs().to(dayjs.unix(parseInt(t)))}

// 将时间格式化为相对格式
const formatMsg =(list)=>{
  list.map((item,i)=>{
    item.msg = JSON.parse(item?.LatestMsg)?.data;
    item.send_time = item?.msg?.send_time? rTime(item?.msg?.send_time):'';
  })
}

// 计算未读消息
const initUnRead =(r,list)=>{
  list.map((o,i)=>{
    let count = 0
    o.map((p,j)=>{
      if (p.UnreadMsgCount) count++
    })
    r[i] = count
  })
}

// 将虚拟客户的名称和公司添加到聊天对象
const formatInfo =(weList,list)=>{
  list.map((o,i)=>{
    o.map((p,j)=>{
      weList.map(item =>{
        if (p.WxId===item.WxId) {
          p.WeUserName = item.UserName
          p.CorpName = item.CorpName
          p.WeAvatar = item.OssAvatar
        }
      })
    })
  })
}


export const procData = (weList,s,t,u,read)=>{
  // 格式化聊天消息和时间
  formatMsg(t)
  formatMsg(u)

  // 计算未读消息
  initUnRead(read, [s,t,u])

  // 补充虚拟客户经理信息
  formatInfo(weList,[s,t,u])
}