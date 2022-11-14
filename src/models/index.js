/* eslint-disable no-param-reassign */
import { observable, action } from 'mobx';
import { message }  from 'antd';
import { request }  from '@/services/request';
import { procData } from '@/utils/procData';

const HEAD = `https://pt-prod.lbian.cn`


export class Index {
  @observable proc = null;

  orgId  = "3301001000005"
  userId = "1522203551195275350"

  setProc = proc => {
    this.proc = proc;
  };
 
  URL_SIGNALR_HUB_IMG    = `${HEAD}/imghub`
  URL_SIGNALR_HUB_MSG    = `${HEAD}/msgimghub`

  
  URL_ONLINE_WX_USR_LIST = `${HEAD}/WxUser/OnlineWxUserList`

  URL_ROOM_CONTACT_LIST  = `${HEAD}/Room/RoomContactList`
  URL_CONTACT_USR_LIST   = `${HEAD}/Contact/GetUserContactList`
  URL_CONTACT_ALL_LIST   = `${HEAD}/Contact/AllContactListWithstatus`
  

  @action
  async getRoomContactList(data) {
    console.log(data)
    const r = await request(this.URL_ROOM_CONTACT_LIST,{ 
      method: 'POST',
      body: JSON.stringify(data) 
    });
    return r
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
    procData(s,t,u,read)

    console.log(s,t,u)
    return { room:s, cont:t, proc: u, read: read}
  }


  @action
  async getOnlineWxUserList() {
    let WxIds = []
    let r = await request(this.URL_ONLINE_WX_USR_LIST,{ method: 'POST', });
    // console.log('r',r)
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
    procData(s,t,u,read)

    return {user:r, room:s, cont:t, proc: u, read:read}
  }
}
