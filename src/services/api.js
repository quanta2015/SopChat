import { stringify } from 'qs';
import {request} from '@/services/request';

const HEAD = `https://pt-prod.lbian.cn`
const URL_CONACT_TOP_REQUEST    = `${HEAD}/Contact/ConactTopRequest`
const URL_CANCEL_CONTACT_TOP_REQUEST    = `${HEAD}/Contact/CancelContactTopRequest`


export async function fakeRegister(data) {
  return request('/api/register', {
    method: 'POST',
    data,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

//置顶联系人
export async function getContactTopList(data){
  const r = await request(URL_CONACT_TOP_REQUEST,{
    method:'POST',
    body:JSON.stringify(data)
  })
  return r
}

// 取消联系人的置顶
export async function getCancelContactTopRequest(data) {
  const r = await request(URL_CANCEL_CONTACT_TOP_REQUEST,{
    method:'POST',
    body:JSON.stringify(data)
  })
}
