import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar' 
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn') 
dayjs.extend(calendar)
dayjs.extend(relativeTime)

export const procData = (list)=>{
    list.map((item,i)=>{
        item.msg = JSON.parse(item?.LatestMsg)?.data;
        console.log('dayjs.unix',dayjs.unix(parseInt(item?.msg?.send_time)));
        item.send_time = item?.msg?.send_time? dayjs().to(dayjs.unix(parseInt(item?.msg?.send_time))):'';
    })
}