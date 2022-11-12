import { stringify } from 'qs';
import {request} from './request';
import { url } from './service-utils';

export async function queryCurrent() {
  return request(`${url.auth}/oauth/loginInfo`);
}

export async function queryUserInfo() {
  return request(`${url.user}/login/userinfo`);
}

export async function fetchIsContact(params) {
  return request(`${url.authWorkApi}/wxauth/use/work/contact?${stringify(params)}`);
}
