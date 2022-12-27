/* eslint-disable no-param-reassign */
import { observable, action,toJS } from 'mobx';
import { message,notification }  from 'antd';
import { request,upload,requestS }  from '@/services/req';
import { procData,initUnRead } from '@/utils/procData';
import { clone }    from '@/utils/common';
import { stringify } from 'qs';
import { formatTime,log,parseFile } from '@/utils/common'
import { MSG } from '@/pages/Index/msg'
import { fileToBlob } from '@/utils/common'
import { url } from '@/services/service-utils.js';


import iconAvatar from '@/imgs/icon-avatar.png'



const HEAD_Z = `https://pt-prod.lbian.cn`
const HEAD_S = `https://rhyy.pre.suosishequ.com/gateway/group/web/internalGroupManager/zm`
const HEAD_T = `https://front.sit.suosihulian.com/gateway/crm/mobile`
const HEAD_M = `https://rhyy.pre.suosishequ.com/gateway/crm/mobile/comchat`


const initTransInfo =(tList,vList,that)=>{
  tList.map((item,i)=>{
    vList.map((o,j)=>{
      if ((item.ConversationId === o.ConversationId)&&(o.FromUserId === that.user.userId)) {
        item.Id = o.Id
        item.info_t = `${o.FromUserName} => ${o.ToUserName}`
        item.status_t = 1
      }
    })
  })
}


export class Index {
  @observable curWe   = -1;
  @observable curUser = null;
  @observable unread  = 0;
  @observable chatHis = [];
  @observable chatRel = {};
  @observable userList = [];
  @observable roomList = [];
  @observable contList = [];
  @observable procList = [];
  @observable tranList = [];
  @observable user = {};
  @observable conf = { robot:false, rid: null };
  @observable userPageNo = 1;
  @observable userPageTo = null;


  URL_ONLINE_WX_USR_LIST  = `${HEAD_M}/onlineManagerList`
  URL_CONTACT_ALL_LIST    = `${HEAD_M}/customerPage`
  URL_ROOM_CONTACT_LIST   = `${HEAD_M}/groupList`
  URL_CONTACT_TRANS_LIST  = `${HEAD_M}/transferCustomerList`
  URL_CONTACT_UNREAD_NUM  = `${HEAD_M}/unreadNum`


  // URL_CONTACT_USR_LIST    = `${HEAD_M}/transferCustomerList`
  // URL_ONLINE_WX_USR_LIST  = `${HEAD_Z}/WxUser/OnlineWxUserList`
  // URL_ROOM_CONTACT_LIST   = `${HEAD_Z}/Room/RoomContactList`
  // URL_ROOM_MEMBER_LIST    = `${HEAD_Z}/Room/RoomMemberList`
  // URL_CONTACT_ALL_LIST    = `${HEAD_Z}/Contact/AllContactListWithstatus`
  // URL_CONTACT_TRANS_LIST  = `${HEAD_Z}/Transfer/List`
  // URL_CONTACT_UNREAD_NUM  = `${HEAD_T}/comchat/unreadNum`
  URL_CONTACT_USR_LIST    = `${HEAD_Z}/Contact/GetUserContactList`
  URL_CONTACT_RELATION    = `${HEAD_Z}/Contact/GetContactRelation`
  URL_CONTACT_SET_TOP     = `${HEAD_Z}/Contact/ConactTopRequest`
  URL_CONTACT_CANCEL_TOP  = `${HEAD_Z}/Contact/CancelContactTopRequest`
  URL_CONTACT_UPDATE_BOT  = `${HEAD_Z}/Contact/UpdateUserBotSetting`
  URL_CONTACT_UPDATE_CST  = `${HEAD_Z}/Contact/UpdateConvsationStatus`
  URL_CONTACT_CONF_LOAD   = `${HEAD_Z}/Contact/GetUserRecSetting`
  URL_CONTACT_CONF_SAVE   = `${HEAD_Z}/Contact/SaveUserRecSetting`
  URL_CONTACT_TRANS_RETURN= `${HEAD_Z}/Transfer/TransferReturn`
  URL_CONTACT_TRANS_BACK  = `${HEAD_Z}/Transfer/TransferBack`

  URL_ROOM_MEMBER_LIST    = `${HEAD_S}/findMemberList?chatId=`
  
  URL_CHAT_HISTORY_LIST   = `${HEAD_M}/chatHistoryPage`
  // URL_CHAT_HISTORY_LIST   = `${HEAD_Z}/ChatHistory/ChatHistorys`
  URL_CHAT_HISTORY_SEARCH = `${HEAD_Z}/ChatHistory/SearchChatHistorys`

  
  URL_CONFIG_UPDATE_BOT   = `${HEAD_Z}/Config/UpdateBotSetting`


  URL_UPLOAD              = `${HEAD_Z}/File/UploadFile`
  URL_CHAT_MSG_TEXT       = `${HEAD_Z}/api/msg/text`
  URL_CHAT_MSG_IMAGE      = `${HEAD_Z}/api/msg/image`
  URL_CHAT_MSG_VIDEO      = `${HEAD_Z}/api/msg/video`
  URL_CHAT_MSG_FILE       = `${HEAD_Z}/api/msg/file`

  @action setUser(e)  { this.user = e }
  @action setCurUser(e)  { this.curUser = e }
  @action setChatHis(e)  { this.chatHis = e }
  @action setChatRel(e)  { this.chatRel = e }
  @action setUserList(e) { this.userList = e }
  @action setRoomList(e) { this.roomList = e }
  @action setContList(e) { this.contList = e }
  @action setProcList(e) { this.procList = e }
  @action setTranList(e) { this.tranList = e }
  

  // 退回转交
  @action
  async updateBotConf(data) {
    let params = {
      method: 'POST',
      body: JSON.stringify(data) 
    };
    await request(this.URL_CONFIG_UPDATE_BOT, params)
  }
  

  // 退回转交
  @action
  async transferReturn(data) {
    let params = {
      method: 'POST',
      body: JSON.stringify({
        Id: data.Id,
      }) 
    };
    await request(this.URL_CONTACT_TRANS_RETURN, params)
  }

  // 收回转交
  @action
  async transferBack(data) {
    console.log(toJS(data),'aaa')
    let params = {
      method: 'POST',
      body: JSON.stringify({
        Id: data.Id,
      }) 
    };
    await request(this.URL_CONTACT_TRANS_BACK, params)
  }



  

  // 发送消息
  @action
  async sendMsg(data) {
    let { WxId, ConversationId, chatId } = this.curUser
    let { realName, corpId, userId } = this.user
    let { ExternalUserId,CorpId } = this.chatRel

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

  // 更新机器人设置
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

  // 发送文件
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

  // 置顶客户
  @action
  async setTop(data) {
    let url = data.isOnTop? this.URL_CONTACT_SET_TOP:this.URL_CONTACT_CANCEL_TOP;
    let params = { 
      method: 'POST',
      body: JSON.stringify(data) 
    };
    const r = await request(url, params);
  }

  // 获取聊天详情列表
  @action
  async getChatInfo(type,item) {
    console.log('item',toJS(item))
    let param =(e)=> { 
      return { 
        method: 'POST',
        body: JSON.stringify({...e}) 
      }
    }
    let paramsS1 = param({
      search: {
        conversationId:item?.conversationId,
        wxId: item.wxId,
      },
      pageNo: 0,
      pageSize: 100,
    })
    let paramsS2 = param({
      WxId: item.wxId,
      chatId: item?.chatId,
      ContactUserId:item?.contactUserId,
      ConversationId:item?.conversationId,
      ConversationIds: [item?.conversationId],
      Type: 0,
      pageIndex: 1,
      pageSize: 100,
    })
    let paramsS3 = param({
      WxId: item.wxId,
        conversationId: [item?.conversationId],
        status: item.currentReceiptionStatus,
        changeStatus: 0,
        orgId: this.user.orgId,
        userId: this.user.userId,
    })


    let r = await request(this.URL_CHAT_HISTORY_LIST, paramsS1)
    let s = await request(this.URL_CONTACT_RELATION, paramsS2)
    let t = await request(this.URL_CONTACT_UPDATE_CST, paramsS3)

    let {current,pageSize,total} = r.data.pagination
    s.more = ((current+1)*pageSize<total)?true:false
    r = r.data.dataSource
    console.log('rrr',r)
    // 用户选中时将小红点清零
    this.curUser.MarkAsUnread = 1
    this.curUser.UnreadMsgCount = 0
    // this.unread = initUnRead(this.contList)

    
    // 是否有更多消息
    // s.more = (r.length=== 100)? true:false

    // 格式化聊天顺序和时间
    r.reverse().map((item,i)=>{
      item.Timestamp = formatTime(item?.Timestamp)
      item.msg = JSON.parse(item?.msg)
    })

    // 群聊要过滤消息内容 添加聊天头像
    if (type===MSG.group) {
      let t = await request(`${this.URL_ROOM_MEMBER_LIST}${item.chatId}`, { method: 'GET' });
      t = t.data.dataSource
      console.log('ttt',t)
      r.map(o=>{
        t.map(p=>{
          if (o.msg.data.sender === p.id) {
            o.WeAvatar = p.OssAvatar 
          }else{
            o.WeAvatar = iconAvatar
          }
        })
        if ((o.msg.type === 11072)||(o.msg.type === 11073)) {
          let userList = o.msg?.data?.member_list.map(e=>e.name).join('","')
          o.sys = 1
          o.inf = (o.msg.type === 11072)?`"${userList}"加入群聊`:`你已将"${userList}"移出群聊`
        }
      })
    }else{
      // 私聊设置聊天头像
      r.map(o=>o.WeAvatar = (o.wxId===o.msg.data.sender)?item.WeAvatar:item.ossAvatar)
    }


    // console.log('his',toJS(r))

    return { his: r, rel: s}
  }


  // 获取客户、群聊、处理客户列表
  @action
  async getDataList(data) {
    // let params = { 
    //   method: 'POST',
    //   body: JSON.stringify({
    //     WxIds: data,
    //     pageIndex:1,
    //     pageSize: 100,
    //     LastTimestamp: 1,
    //     status: 0,
    //     orgId: this.user.orgId,
    //     userId: this.user.userId,
    //   }) 
    // };

    // let s = await request(this.URL_ROOM_CONTACT_LIST,params);
    // let t = await request(this.URL_CONTACT_ALL_LIST, params);
    // let u = await request(this.URL_CONTACT_USR_LIST, params);
    let param =(e)=> { 
      return { 
        method: 'POST',
        body: JSON.stringify({...e}) 
      }
    }
    let paramsS1 = param({
      search: { wxIdList: data },
      pageSize: 10,
      pageNo: 0,
    })

    let paramsS2 = param({
      search: { wxIdList: data, status: 0 }
    })
    let paramsS3 = param({ wxIdList: data})


    let t = await requestS(this.URL_CONTACT_ALL_LIST,paramsS1);
    let u = await requestS(this.URL_CONTACT_ALL_LIST,paramsS2);
    let s = await requestS(this.URL_ROOM_CONTACT_LIST,paramsS3);
    t = t.dataSource
    s = s.dataSource
    u = u.dataSource

    // console.log('data',data)

    procData(this.userList,s,t,u)

    // console.log(s,t,u)
    return { room:s, cont:t, proc: u}
  }


  // 获取虚拟客户经理、客户、群聊、处理客户列表
  @action
  async getOnlineWxUserList() {
    let WxIds = []
    let r = await requestS(this.URL_ONLINE_WX_USR_LIST)
    r = r.dataSource
    this.setUserList(r)
    console.log('URL_ONLINE_WX_USR_LIST',r)
    
    r.map((o,i)=>WxIds.push(o.wxId))
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

    let param =(e)=> { 
      return { 
        method: 'POST',
        body: JSON.stringify({...e}) 
      }
    }
    let paramsS1 = param({
      search: { wxIdList: WxIds },
      pageSize: 10,
      pageNo: 0,
    })

    let paramsS2 = param({
      search: { wxIdList: WxIds, status: 0 }
    })
    let paramsS3 = param({ wxIdList: WxIds})


    let t = await requestS(this.URL_CONTACT_ALL_LIST,paramsS1);
    let u = await requestS(this.URL_CONTACT_ALL_LIST,paramsS2);
    let s = await requestS(this.URL_ROOM_CONTACT_LIST,paramsS3);
    let v = await requestS(this.URL_CONTACT_TRANS_LIST);
    let z = await request(this.URL_CONTACT_CONF_LOAD,params);
    let n = await request(this.URL_CONTACT_UNREAD_NUM,paramsS3);
    
    this.userPageNo = t.pagination.current
    this.userPageTo = t.pagination.total
    t = t.dataSource
    s = s.dataSource
    u = u.dataSource
    v = v.dataSource
    n = n.dataSource


    procData(this.userList,s,t,u)
    this.unread = initUnRead(t)

    // All 计算转交标记
    v.map((o,j)=>{
      o.LatestMsg = JSON.parse(o.LatestMsg)
      o.lastMsg = o.LatestMsg?.data?.content
      o.OssAvatar = o.TransferWxIcon
      o.Avatar = o.TransferWxIcon
      o.UserName = o.TransferWxName
      if (o.ToUserId === this.user.userId) {
        o.info_t = `${o.FromUserName} => ${o.ToUserName}`
        o.status_t = 2
      }else if (o.FromUserId === this.user.userId) {
        o.info_t = `${o.FromUserName} => ${o.ToUserName}`
        o.status_t = 1
      }else {
        o.status_t = 0
      }
      o.toMe = (o.ToUserId===this.user.userId)
    })

    initTransInfo(t,v,this)
    initTransInfo(u,v,this)
    
    // console.log('ROOM_LIST',s)
    // console.log('ALL_LIST',t)
    // console.log('USR_LIST',u)
    // console.log('TRAN_LIST',v)
    // console.log('UNREAD',n)

    
    this.conf = {
      robot: z.turnon===1?true:false,
      rid: z.id
    }
    
    this.setProcList(u)
    this.setRoomList(s)
    this.setContList(t)
    this.setTranList(v)
  }

  


  // 获取处理中客户列表
  @action
  async refreshProcList(e) {
    let WxIds = []
    this.userList.map(o=>WxIds.push(o.wxId))

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
        turnon: e?1:0,
        id: this.conf.rid,
      }) 
    }
    const u = await request(this.URL_CONTACT_USR_LIST,params)
    const z = await request(this.URL_CONTACT_CONF_SAVE,params)
    procData(this.userList,[],[],u)

    this.conf.robot = e
    this.setProcList(u)
  }


  // 用户登录鉴权
  @action
  async login() {
    const env = "pre"
    const params = {
      client_id: env,
      client_secret: env,
      from: "normal",
      // username: "17839637528",
      // password: "59a7f9cfa6d9b19914659110debf8cdc",
      // username: "13657086451",
      // password: "4af29b04aba82d265b7a0a5cf14eb657",
      username: "15201873797",
      password: "b6ed1a09ca47340ac6bffd5e69cec127",
      
    }
    const SERVER = `https://rhyy.pre.suosishequ.com`
    let r = await request(`${SERVER}/gateway/auth/oauth/token?${stringify(params)}`)
    let token = `${r.data.tokenHead}${r.data.accessToken}`
    window.token = window.token || token;

    let s = await request(`${SERVER}/gateway/auth/oauth/loginInfo`)
    this.setUser(s.data)
    // console.log(token)
  }


  // -- Client ---------------------------------------------------
  @action
  async initClient() {
    let { CorpId, ExternalUserId, UnionId } = this.chatRel;
    let prefix = `${url.usercenter}/web/maternal/user/unionid/detail?corpId=${CorpId}`;
    let _url = UnionId?`${prefix}&unionid=${UnionId}`:`${prefix}&externalUserId=${ExternalUserId}`;

    let r = await request(_url);
    let detail = r.data.formValue
    parseFile(detail)

    let s = await request(`${url.usercenter}/web/maternal/viwe/getFormColumn`);
    let { dataSource } = s.data
    const control = dataSource?.filter(item => {
      return !['avatar'].includes(item.name);
    }); 



    return { detail,control }
  }

  
}


