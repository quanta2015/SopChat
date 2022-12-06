/* eslint-disable no-param-reassign */
import { observable, action,toJS } from 'mobx';
import { message }  from 'antd';
import { request,upload }  from '@/services/request';
import { procData } from '@/utils/procData';
import { clone }    from '@/utils/common';
import { formatTime } from '@/utils/common'
import { MSG } from '@/pages/Index/msg'
import { fileToBlob } from '@/utils/common'

const HEAD = `https://pt-prod.lbian.cn`

console.log('window.token',window.token)


export class Index {
  @observable curUser = null;
  @observable chatHis = [];
  @observable chatRel = {};
  @observable userList = [];
  @observable roomList = [];
  @observable contList = [];
  @observable procList = [];

  weList = []

  orgId  = "3301001000005"
  userId = "1522203551195275350"
 
  URL_ONLINE_WX_USR_LIST  = `${HEAD}/WxUser/OnlineWxUserList`
  URL_ROOM_CONTACT_LIST   = `${HEAD}/Room/RoomContactList`
  URL_ROOM_MEMBER_LIST    = `${HEAD}/Room/RoomMemberList`
  URL_CONTACT_USR_LIST    = `${HEAD}/Contact/GetUserContactList`
  URL_CONTACT_ALL_LIST    = `${HEAD}/Contact/AllContactListWithstatus`
  URL_CONTACT_RELATION    = `${HEAD}/Contact/GetContactRelation`
  URL_CONTACT_SET_TOP     = `${HEAD}/Contact/ConactTopRequest`
  URL_CONTACT_CANCEL_TOP  = `${HEAD}/Contact/CancelContactTopRequest`
  URL_CHAT_HISTORY_LIST   = `${HEAD}/ChatHistory/ChatHistorys`
  URL_CHAT_HISTORY_SEARCH = `${HEAD}/ChatHistory/SearchChatHistorys`


  URL_UPLOAD              = `${HEAD}/File/UploadFile`
  URL_CHAT_MSG_IMAGE      = `${HEAD}/api/msg/image`
  URL_CHAT_MSG_VIDEO      = `${HEAD}/api/msg/video`
  URL_CHAT_MSG_FILE       = `${HEAD}/api/msg/file`




  @action setCurUser(e)  { this.curUser = e }
  @action setChatHis(e)  { this.chatHis = e }
  @action setChatRel(e)  { this.chatRel = e }
  @action setUserList(e) { this.userList = e }
  @action setRoomList(e) { this.roomList = e }
  @action setContList(e) { this.contList = e }
  @action setProcList(e) { this.procList = e }



  @action
  async sendFile(file) {
    let url 
    let formData = new FormData()
    let type  = file.type.split('/')[0]
    // console.log(type)
    switch(type) {
      case 'image': 
        const blob = await fileToBlob(file);
        formData.append('file', blob, file.name);
        url = this.URL_CHAT_MSG_IMAGE;
        break;
      case 'video':
        formData.append('file', file, file.name);
        url = this.URL_CHAT_MSG_VIDEO;
        break;
      default:
        formData.append('file', file, file.name);
        url = this.URL_CHAT_MSG_FILE;
    }
    const r = await upload(this.URL_UPLOAD, formData)
    const { WxId,ConversationId,WeUserName,chatId } = toJS(this.curUser)
    const { ExternalUserId,CorpId } = toJS(this.chatRel)

    const params = {
      method: 'POST',
      body: JSON.stringify({
        FileUrl: r,
        WxId: WxId,
        CorpId: CorpId,
        senderName: WeUserName,
        ConversationId: ConversationId,
        msgSource: 'api_artificial_input',
        unionIdOrChatId: ConversationId.includes('R') ? chatId : ExternalUserId,
      })
    }
    const s = await request(url, params)
  }




  @action
  async setTop(data) {
    let url = data.isOnTop? this.URL_CONTACT_SET_TOP:this.URL_CONTACT_CANCEL_TOP;
    let params = { 
      method: 'POST',
      body: JSON.stringify(data) 
    };
    const r = await request(url, params);
  }

  @action
  async getChatInfo(data,type,we) {
    let params = {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        Type: 0,
        pageSize: 100,
      }) 
    };
    let r = await request(this.URL_CHAT_HISTORY_LIST, params)
    let s = await request(this.URL_CONTACT_RELATION, params)

    // 是否有更多消息
    s.more = (r.length=== 100)? true:false

    // 格式化聊天顺序和时间
    r.reverse().map((item,i)=>{
      item.Timestamp = formatTime(item.Timestamp)
      item.Msg = JSON.parse(item.Msg)
    })

    // 群聊要过滤消息内容 添加聊天头像
    if (type===MSG.group) {
      let t = await request(this.URL_ROOM_MEMBER_LIST, params);

      // 过滤群聊消息
      r = r.filter(o=> o.WxId.length === MSG.len)
           .filter(o=> o.Msg.type !== MSG.mem)

      r.map(o=>{
        t.map(p=>{
          if (o.Msg.data.sender === p.UserId) {
            o.WeAvatar = p.OssAvatar
          }
        })
      })
    }else{
      // 私聊设置聊天头像
      r.map(o=>o.WeAvatar = (o.WxId===o.Msg.data.sender)?we.WeAvatar:we.Avatar)
    }

    return { his: r, rel: s}
  }

  @action
  async getDataList(data) {
    let params = { 
      method: 'POST',
      body: JSON.stringify({
        WxIds: data,
        pageIndex:1,
        pageSize: 100,
        LastTimestamp: 1,
        status: 0,
        orgId: this.orgId,
        userId: this.userId,
      }) 
    };

    const s = await request(this.URL_ROOM_CONTACT_LIST,params);
    const t = await request(this.URL_CONTACT_ALL_LIST, params);
    const u = await request(this.URL_CONTACT_USR_LIST, params);
    const read = [0,0,0]
    procData(this.weList,s,t,u,read)

    console.log(s,t,u)
    return { room:s, cont:t, proc: u, read: read}
  }


  @action
  async getOnlineWxUserList() {
    let WxIds = []
    let r = await request(this.URL_ONLINE_WX_USR_LIST,{ method: 'POST', });
    // console.log('r',r)

    this.weList = clone(r)
    r.map((o,i)=>WxIds.push(o.WxId))
    let params = { 
      method: 'POST',
      body: JSON.stringify({
        WxIds: WxIds,
        pageIndex:1,
        pageSize: 100,
        LastTimestamp: 1,
        status: 0,
        orgId: this.orgId,
        userId: this.userId,
      }) 
    };
    const s = await request(this.URL_ROOM_CONTACT_LIST,params);
    const t = await request(this.URL_CONTACT_ALL_LIST,params);
    const u = await request(this.URL_CONTACT_USR_LIST,params);

    const read = [0,0,0]
    procData(this.weList,s,t,u,read)

    return {user:r, room:s, cont:t, proc: u, read:read}
  }
}
