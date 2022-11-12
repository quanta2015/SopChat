// import axios from 'axios';
// import { message } from 'antd';
// import { stringify } from 'qs';
// import { gotoLogin } from '../utils/utils';
// import { getLogInfo } from './log';
// import packageData from '../../package.json';

// export const useComponent = ['suo-web-all'];

// export default async function request(url, options = {}) {
//   const appCode = getLogInfo();
//   const filterUseComponent = () => {
//     const newObj = {};
//     if (packageData?.dependencies) {
//       const obj = packageData.dependencies;
//       for (const key in obj) {
//         if (Object.prototype.hasOwnProperty.call(obj, key)) {
//           const element = obj[key];
//           useComponent.forEach(item => {
//             if (item === key) {
//               newObj[key] = element;
//             }
//           });
//         }
//       }
//     }
//     return newObj;
//   };
//   const { headers } = options;

//   const token = headers ? headers['Access-Token'] : '';
//   return new Promise((resolve, reject) => {
//     return axios({
//       url,
//       ...options,
//       headers: {
//         'page-log': decodeURIComponent(stringify({ ...filterUseComponent(), appCode })),
//         'app-code': appCode,
//         Authorization: window.token,
//         'Access-Token': token, // token
//       },
//     })
//       .then(response => {
//         const { data } = response;
//         if (data.code === 200 || data.code === 0 || data.code === '200') {
//           return resolve(data.data || data.result || data);
//         } else if (data.code === 21002 || data.code === 21018 || data.code === 21019) {
//           return reject(data);
//         } else if (data.code === 401) {
//           message.error(data.msg);
//           gotoLogin();
//           return resolve(data);
//         } else {
//           message.error(data.msg || '网络错误，请重试');
//           return reject(data || {});
//         }
//       })
//       .catch(error => {
//         const { response } = error || {};
//         const { data } = response || {};
//         return reject(data || {});
//       });
//   });
// }


export async function request(url, opt = {}) {
  return new Promise((resolve, reject) => {
    return fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: window.token,
        "Content-Type": "application/json;charset=UTF-8",
      },
      ...opt,
    })
    .then((response) => response.json())
    .then((data) => {
      resolve(data)
    });
  })
}

