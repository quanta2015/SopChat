/* eslint-disable import/prefer-default-export */
export const ENV = (document.querySelector('meta[name="x-server-env"]') || { content: 'dev' })
  .content;

export function GetQueryString(name) {
  const regArr = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(regArr);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

export function funVerifySuccess() {
  const PN = window.location.pathname;
  let res = !0;
  ['iframe', 'o2oa', 'RDP-SERVER', 'msgsend'].map(item => {
    if (PN.indexOf(item) !== -1) {
      res = !1;
    }
    return !1;
  });
  return res;
}

export const readObj = {
  meeting: {
    test: {
      countId: 6,
      appId: 45,
    },
    dev: {
      countId: 6,
      appId: 45,
    },
    production: {
      countId: 6,
      appId: 45,
    },
  },
  wages: {
    test: {
      countId: 1,
      appId: 23,
    },
    dev: {
      countId: 1,
      appId: 23,
    },
    production: {
      countId: 1,
      appId: 23,
    },
  },
  safeClock: {
    // countId后端返回
    test: {
      appId: 54,
    },
    dev: {
      appId: 54,
    },
    production: {
      appId: 54,
    },
  },
};
