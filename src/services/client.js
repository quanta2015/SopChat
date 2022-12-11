import request from './request.js';
import { url } from './service-utils.js';

export function getWelcomgetGroupMemberDetailText() {
  return request(`${url.group}/app/group/member/customer/getGroupMemberDetail`);
}

export function getGroupMemberDetailUpdate() {
  return request(`${url.group}/app/group/member/customer/getGroupMemberDetailUpdate`);
}

// 客户资料视图
export function getMemberFormColumn() {
  return request(`${url.usercenter}/web/maternal/viwe/getFormColumn`);
}