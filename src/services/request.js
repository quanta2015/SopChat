/* eslint-disable react/no-danger */
/* eslint-disable no-shadow */
import React from 'react';
import axios from 'axios';
import store from 'store2';
import { parse, stringify } from 'qs';
import { message } from 'antd';
import packageData from '../../package.json';

const useComponent = ['suo-web-all'];

export default function request(url, options = { method: 'GET' }) {
  // 过滤
  const filterUseComponent = () => {
    const newObj = {};
    if (packageData?.dependencies) {
      const obj = packageData.dependencies;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const element = obj[key];
          useComponent.forEach(item => {
            if (item === key) {
              newObj[key] = element;
            }
          });
        }
      }
    }
    return newObj;
  };

  const { method = 'get', data } = options;
  let _appCode = '';
  if (method.toLowerCase() === 'get') {
    const { appCode: getAppcode } = parse(url.split('?')[1]);
    _appCode = getAppcode;
  } else {
    const { appCode: postAppcode } = data;
    _appCode = postAppcode;
  }
  const { appCode } = parse(window.location.search.slice(1));
  const pageLog = decodeURIComponent(
    stringify({ ...filterUseComponent(), appCode: _appCode || appCode }),
  );

  return new Promise((resolve, reject) => {
    let params = {};
    let corpid;
    let currentUserId;
    let appId;

    const urlArray = url.split('?');
    if (urlArray.length > 1) {
      params = parse(urlArray[1]);
    }

    const search = parse(window.location.search.slice(1)) || {};
    if (!(corpid = store.session('corpid'))) {
      // 首次进入页面从url中获取corpid
      // eslint-disable-next-line
      corpid = search.corpid;
      store.session('corpid', corpid);
    }

    if (!(currentUserId = store.session('workflow_userId'))) {
      // 首次进入页面从url中获取currentUserId
      // eslint-disable-next-line
      currentUserId = search.userId;
      store.session('workflow_userId', currentUserId);
    }

    if (!(appId = store.session('workflow_appId'))) {
      // 首次进入页面从url中获取appId
      // eslint-disable-next-line
      appId = search.appId || search.xCAppId;
      store.session('workflow_appId', appId);
    }

    // const handlerId = store.session('handlerId');
    // const handlerOrgId = store.session('handlerOrgId');
    // debugger;
    // corpid需要拼接到url上
    // console.log(window.token, 'window.token');
    return axios({
      url: `${urlArray[0]}?${stringify({
        currentUserId,
        appId,
        ...params,
        corpid,
        // 先注释掉，否则我发起的详情接口会报用户身份为空的错误
        // ...{ handlerId, handlerOrgId },
      })}`,
      headers: {
        Authorization: window.token,
        'page-log': pageLog,
        'app-code': _appCode || appCode,
      },
      // withCredentials: true,

      ...options,
    })
      .then(response => {
        const { data } = response;
        if (data.code === 0 || data.result === 0) {
          resolve(data.data || data.result);
        } else {
          if (data?.msg?.indexOf('<br/>')) {
            message.warning({
              content: (
                <div
                  dangerouslySetInnerHTML={{
                    __html: data?.msg,
                  }}
                />
              ),
              className: 'custom-antd-message',
              duration: 6,
            });
          } else {
            message.error(data.msg || '网络错误');
          }
          // message.error(data.msg || '网络请求失败');
          reject(data);
        }
      })
      .catch(response => {
        reject(response);
      });
  });
}
