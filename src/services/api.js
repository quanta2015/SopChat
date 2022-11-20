import { stringify } from 'qs';
import {request} from '@/services/request';

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
