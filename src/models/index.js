/* eslint-disable no-param-reassign */
import { observable, action,toJS } from 'mobx';
import { message }  from 'antd';
import { request,upload }  from '@/services/request';
import { procData } from '@/utils/procData';
import { clone }    from '@/utils/common';
import { formatTime,log } from '@/utils/common'
import { MSG } from '@/pages/Index/msg'
import { fileToBlob } from '@/utils/common'
import iconAvatar from '@/imgs/icon-avatar.png'





const HEAD_Z = `https://pt-prod.lbian.cn`
const HEAD_S = `https://rhyy.pre.suosishequ.com/gateway/group/web/internalGroupManager/zm`

const Z = {
  tran_n: 0,
  tran_b: 1,
  tran_t: 2,
}


export class Index {
  @observable curUser = null;
  @observable chatHis = [];
  @observable chatRel = {};
  @observable userList = [];
  @observable roomList = [];
  @observable contList = [];
  @observable procList = [];
  @observable tranList = [];

  weList = []
  user   = {
    "realName": "李建彬",
    "orgName": "杭州所思互连科技有限公司",
    "corpId": "ww3eaf4f90528f7c0e",
    "userId": "1522203551195275350",
    "orgId": "3301001000005"
  }
  
 
  URL_ONLINE_WX_USR_LIST  = `${HEAD_Z}/WxUser/OnlineWxUserList`
  URL_ROOM_CONTACT_LIST   = `${HEAD_Z}/Room/RoomContactList`
  // URL_ROOM_MEMBER_LIST    = `${HEAD_Z}/Room/RoomMemberList`
  URL_ROOM_MEMBER_LIST    = `${HEAD_S}/findMemberList?chatId=`
  URL_CONTACT_USR_LIST    = `${HEAD_Z}/Contact/GetUserContactList`
  URL_CONTACT_ALL_LIST    = `${HEAD_Z}/Contact/AllContactListWithstatus`
  URL_CONTACT_RELATION    = `${HEAD_Z}/Contact/GetContactRelation`
  URL_CONTACT_SET_TOP     = `${HEAD_Z}/Contact/ConactTopRequest`
  URL_CONTACT_CANCEL_TOP  = `${HEAD_Z}/Contact/CancelContactTopRequest`
  URL_CONTACT_UPDATE_BOT  = `${HEAD_Z}/Contact/UpdateUserBotSetting`


  URL_CHAT_HISTORY_LIST   = `${HEAD_Z}/ChatHistory/ChatHistorys`
  URL_CHAT_HISTORY_SEARCH = `${HEAD_Z}/ChatHistory/SearchChatHistorys`


  URL_CONTACT_TRANSFER    = `${HEAD_Z}/Transfer/List`


  URL_UPLOAD              = `${HEAD_Z}/File/UploadFile`
  URL_CHAT_MSG_TEXT       = `${HEAD_Z}/api/msg/text`
  URL_CHAT_MSG_IMAGE      = `${HEAD_Z}/api/msg/image`
  URL_CHAT_MSG_VIDEO      = `${HEAD_Z}/api/msg/video`
  URL_CHAT_MSG_FILE       = `${HEAD_Z}/api/msg/file`


  @action setCurUser(e)  { this.curUser = e }
  @action setChatHis(e)  { this.chatHis = e }
  @action setChatRel(e)  { this.chatRel = e }
  @action setUserList(e) { this.userList = e }
  @action setRoomList(e) { this.roomList = e }
  @action setContList(e) { this.contList = e }
  @action setProcList(e) { this.procList = e }
  @action setTranList(e) { this.tranList = e }
  


  @action
  async sendMsg(data) {
    let {WxId, ConversationId,chatId } = this.curUser
    let {realName,corpId,userId} = this.user
    const { ExternalUserId,CorpId } = this.chatRel

    let params = {
      method: 'POST',
      body: JSON.stringify({
        WxId,
        ConversationId,
        CorpId: corpId,
        senderName: realName,
        Content: data,
        unionIdOrChatId: ConversationId.includes('R:')?chatId:ExternalUserId,
        Id: 'JHLT_' + userId + '_' + Date.now(),
        msgSource: 'api_artificial_input',
      }) 
    };
    let r = await request(this.URL_CHAT_MSG_TEXT, params)
  }


  @action
  async updateBotSetting(data) {
    this.curUser.Markasantibot = data?0:1
    let params = {
      method: 'POST',
      body: JSON.stringify({
        WxId: this.curUser.WxId,
        conversationId: this.curUser.ConversationId,
        turnon: data?'true':'false'
      }) 
    };
    let r = await request(this.URL_CONTACT_UPDATE_BOT, params)
  }

  @action
  async finishProc() {
    console.log('finishProc')
  }


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
      let t = await request(`${this.URL_ROOM_MEMBER_LIST}${data.chatId}`, { method: 'GET' });
      t = t.data.dataSource
      // console.log('ttttt',t)


      console.log(r)
      // 过滤群聊消息
      // r = r.filter(o=> o.WxId.length === MSG.len)
           // .filter(o=> o.Msg.type !== MSG.mem)

      r.map(o=>{
        t.map(p=>{
          if (o.Msg.data.sender === p.id) {
            o.WeAvatar = p.OssAvatar 
          }else{
            o.WeAvatar = iconAvatar
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
        orgId: this.user.orgId,
        userId: this.user.userId,
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
        orgId: this.user.orgId,
        userId: this.user.userId,
      }) 
    };
    const s = await request(this.URL_ROOM_CONTACT_LIST,params);
    const t = await request(this.URL_CONTACT_ALL_LIST,params);
    const u = await request(this.URL_CONTACT_USR_LIST,params);
    const v = await request(this.URL_CONTACT_TRANSFER,params);


    log(v,'trans')

    const read = [0,0,0]
    procData(this.weList,s,t,u,read)

    let tran = []
    // All 计算转交标记
    t.map((item,i)=>{
      v.map((o,j)=>{
        // console.log(o.ConversationId,item.ConversationId)
        if (o.ConversationId===item.ConversationId) {
          item.status_t = Z.tran_n
          // console.log(o)
          if (o.ToUserId === this.user.userId) {
            item.info_t = `${o.FromUserName} => ${o.ToUserName}`
            item.status_t = Z.tran_t
          }else if (o.FromUserId === this.user.userId) {
            item.info_t = `${o.FromUserName} => ${o.ToUserName}`
            item.status_t = Z.tran_b
          }else {
            item.status_t = Z.tran_n
          }
          tran.push({...item,...o})
        }
      })
    })

    // Trans
    tran.map(o=> o.toMe = (o.ToUserId===this.user.userId) )

    // console.log(tran,'trans')

    this.setUserList(r)
    this.setProcList(u)
    this.setRoomList(s)
    this.setContList(t)
    this.setTranList(tran)


    return {read:read}
    
  }


  @action
  async getProcList() {
    let WxIds = []
    this.weList.map(o=>WxIds.push(o.WxId))

    let params = { 
      method: 'POST',
      body: JSON.stringify({
        WxIds: WxIds,
        pageIndex:1,
        pageSize: 100,
        LastTimestamp: 1,
        status: 0,
        orgId: this.user.orgId,
        userId: this.user.userId,
      }) 
    };
    const u = await request(this.URL_CONTACT_USR_LIST,params);
    const read = [0,0,0]
    procData(this.weList,[],[],u,read)
    return {proc: u}
  }



}
