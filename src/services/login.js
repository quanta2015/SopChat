import store from 'store2';
import { stringify } from 'qs';
import request from './request';
import withCodeRequest from './withCodeRequest';
import { url } from './service-utils';

/**
 * 登录
 */
export function login(data) {
  return withCodeRequest(`${url.auth}/checkPwd`, {
    method: 'post',
    data,
  });
}

/**
 * 获取所属机构
 */
export function querySchools() {
  const data = {
    mobile: store.session('user-mobile'),
  };

  return request(`${url.auth}/getSchoolList?${stringify(data)}`);
}

/**
 * 登出
 */
export function logout() {
  return request(`${url.auth}/loginout`);
}

/**
 * 获取验证码
 */
export function sendCode(data) {
  return withCodeRequest(`//xx`, {
    method: 'post',
    data,
  });
}

/**
 * 获取验证码
 */
export function modifyPwd(data) {
  return withCodeRequest(`//uxx`, {
    method: 'post',
    data,
  });
}
