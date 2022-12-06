/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import store from 'store2';
import { parse, stringify } from 'qs';
import { history } from 'umi';







export const gotoLogin = () => {
  history.push(`/user/login`);
};

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path,
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export const importCDN = (url, name) =>
  new Promise(resolve => {
    const dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve(window[name]);
    };
    document.head.appendChild(dom);
  });

export function isObjNull(obj) {
  return typeof obj === 'undefined' || obj == null || JSON.stringify(obj) === '{}';
}

export function getSearchParam(fieldValue, trulyResult = null, falselyResult = null) {
  if (isObjNull(fieldValue) || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
    return falselyResult;
  }

  if (trulyResult === null) {
    return fieldValue;
  }

  if (typeof trulyResult === 'function') {
    return trulyResult();
  }

  return trulyResult;
}

export function GetQueryString(name) {
  const regArr = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(regArr);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

export function formatTimestamp(t) {
  if (isObjNull(t)) {
    return '-';
  }

  return moment(+t).format('YYYY-MM-DD HH:mm:ss');
}

export function formatPrice(p, { isToString = true } = {}) {
  if (!isToString) {
    return Number(p);
  }

  return p.toLocaleString();
}

export function parsePrice(p) {
  return parseFloat(Number(p).toFixed(10));
}

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

export const formItemLayoutModal = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

export const getUrlSearchParams = (location = null) => {
  const l = location || window.location;
  return parse(l.search.slice(1));
};

const defaultTitleMap = {
  add: '新增',
  edit: '编辑',
  query: '查看',
};
/**
 * 根据参数，获取页面Title
 * @param {Object}
 * location：this.props.location
 * matchPath：数组类型，当location.pathname命中数组中的对象时，会去获取对应title
 * titleMap：title的映射关系，search中的type(默认为type，可通过qsKey属性更改)的值为map的key
 * qsKey：将location.pathname[qsKey]中的值拿来做titleMap的匹配
 */
export const getPageHeaderTitle = ({
  location,
  matchPath = [],
  titleMap = defaultTitleMap,
  qsKey = 'type',
}) => {
  let ret = '';

  // 表单页动态设置title
  if (matchPath.includes(location.pathname)) {
    const params = parse(location.search.slice(1));
    ret = titleMap[params[qsKey]];
  }

  return ret;
};

/**
 * 判断searchParams对象中，是否有属性不为空
 */
export function searchParamsHasValue(searchParams) {
  let ret = false;

  const keys = Object.keys(searchParams);
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    if (isObjNull(searchParams[key]) === false) {
      ret = true;
      break;
    }
  }

  return ret;
}

export function listenPageChange({ history: _history, dispatch }) {
  return url =>
    _history.listen(({ pathname }) => {
      if (pathname.startsWith(url) !== true || window.historyPathNameArr.length < 2) {
        return;
      }

      if (window.historyPathNameArr[1].startsWith(url) === false) {
        dispatch({ type: 'resetState' });
      }
    });
}

// 获取页面查询参数
export const getUrlParams = params => {
  const result = {};

  function getRequestParam(name) {
    const requestReg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = window.location.search.substr(1).match(requestReg);
    if (r !== null) return unescape(r[2]);
    return '';
  }

  if (Array.isArray(params)) {
    params.forEach(param => {
      result[param] = getRequestParam(param);
    });
  } else {
    result[params] = getRequestParam(params);
  }

  return result;
};

// 判断是否是IE浏览器  不是IE浏览器 返回 -1 是则返回对应版本号
export const IEVersion = () => {
  const { userAgent } = navigator; // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否IE的Edge浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    const fIEVersion = parseFloat(RegExp.$1);
    if (fIEVersion === 7) {
      return 7;
    }
    if (fIEVersion === 8) {
      return 8;
    }
    if (fIEVersion === 9) {
      return 9;
    }
    if (fIEVersion === 10) {
      return 10;
    }
    return 6; // IE版本<=7
  }
  if (isEdge) {
    return 'edge'; // edge
  }
  if (isIE11) {
    return 11; // IE11
  }
  return -1; // 不是ie浏览器
};

/**
 * 根据路由地址 将 v2替换成 v2/iframne
 * @param {String} url: 要跳转的路由地址
 * @param {String} params: 参数
 */
export const getIframeUrl = (url, params) => {
  let newUrl = url;
  const newParams = params && params.length ? params : '';
  const { href } = window.location;
  if (href.indexOf('/v2/iframe') > -1 && url.indexOf('/v2/iframe') === -1) {
    newUrl = newUrl.replace('/v2', `/v2/iframe`);
  }

  return `${newUrl}${newParams}`;
};

/**
 * 获取当前路径下的面包屑
 * @param {Object} currentUrl: 当前url
 * @param {String} storekey: 面包屑在缓存中存储的key值
 * @param {Boolean} isTop: 是否是顶级节点
 */
export const getCurrentBreadCrumbs = ({
  currentUrl = {},
  storekey = 'currentBreadCrumbs',
  isTop = false,
} = {}) => {
  let newBreadCrumbs = []; // 最新的面包屑
  const currentBreadCrumbs = store.session(storekey); // 本地存储的面包屑

  // 是否是顶级节点，是： 直接返回，默认否
  if (isTop) {
    store.session(storekey, [currentUrl]);
    return [currentUrl];
  }

  // 缓存中没有数据就将当期面包屑添加到缓存中
  if (!currentBreadCrumbs && !!currentUrl) {
    newBreadCrumbs = [currentUrl];
  }

  // 如果缓存中有面包屑数据，且传入当期路径，
  if (!!currentBreadCrumbs && !!currentUrl) {
    const currentUrlIndex = currentBreadCrumbs.findIndex(({ path }) => {
      return path === currentUrl.path;
    });

    // 面包屑中有当前路径则截取到当前路径部分
    if (currentUrlIndex > -1) {
      newBreadCrumbs = currentBreadCrumbs.slice(0, currentUrlIndex + 1);
    } else {
      // 没有当前路径则加入
      newBreadCrumbs = [...currentBreadCrumbs, currentUrl];
    }
  }

  // 去除莫名其妙的数据
  newBreadCrumbs = newBreadCrumbs.filter(({ context }) => !!context);
  store.session(storekey, newBreadCrumbs);
  return newBreadCrumbs;
};

/**
 * 设置加载属性
 * @param {Function} put: modal中的put方法
 * @param {Boolean} spinning：加载状态，true || false
 * @param {String} tip: spinning为true时，显示的文案
 */
export const setSpinProps = ({ put, spinning = false, tip = '', ...other }) => {
  return put({
    type: 'save',
    payload: {
      spinProps: {
        spinning,
        tip,
      },
      ...other,
    },
  });
};

/**
 * @function 滚动到指定位置方法
 * @param startNum {int} -- 开始位置
 * @param stopNum {int} -- 结束位置
 */
export const animationToAnchor = (startNum, stopNum, dom) => {
  const scrollDom = dom || window.document.body;
  let nowNum = startNum + 10; // 步进为10

  if (nowNum > stopNum) {
    nowNum = stopNum;
  }

  // 缓动方法
  window.requestAnimationFrame(() => {
    scrollDom.scrollTop = nowNum; // 当前示例页面，滚动条在body，所以滚动body

    // 滚动到预定位置则结束
    if (nowNum === stopNum) {
      return;
    }

    animationToAnchor(nowNum, stopNum); // 只要还符合缓动条件，则递归调用
  });
};

/**
 * @function 输入框光标移动到末尾
 * @param obj 原生Node对象
 */
export const keepLastIndex = obj => {
  if (window.getSelection) {
    // ie11 10 9 ff safari
    obj.focus(); // 解决ff不获取焦点无法定位问题
    const range = window.getSelection(); // 创建range
    range.selectAllChildren(obj); // range 选择obj下所有子内容
    range.collapseToEnd(); // 光标移至最后
  } else if (document.selection) {
    // ie10 9 8 7 6 5
    const range = document.selection.createRange(); // 创建选择对象
    // var range = document.body.createTextRange();
    range.moveToElementText(obj); // range定位到obj
    range.collapse(false); // 光标移至最后
    range.select();
  }
};

// 特殊字符正则判断
export const specialRegex = /[^\u4e00-\u9fa5a-zA-Z\d\s,.，。？?！；：:"“‘+= 、…^\-*/'·～~@#¥$%&_!—「」【】《》()（）<>{}|[\]]+/;

// o2oa 地址配置
export const O2oaPath = {
  path: 'https://auth.xxx.com/o2oa/web/app/redirect',
  pathParams:
    'https://auth.xx.com/o2oa/web/app/redirect?callbackUrl=https%3A%2F%2Fhzoa.api.xx.com%2Fx_desktop%2Fportal.html%3Fid%3D',
};

// RDP统计报地址（域名 + 路径）共用公共部分
export const RDP_PUBLIC_URL = '//rdp.xx.com/RDP-SERVER/rdppage/main';

// RDP统计报地址（域名 + 路径）共用公共部分 新地址
export const NEW_RDP_PUBLIC_URL = '//rdp3.xx.com/RDP-SERVER/rdppage/main';

// 教育督导-嵌入iframe外链地址
export const supervisionPath = '//page.xx.com';

// 若是企微内核浏览器 => 若是mac或windows系统浏览 返回true
export const handleUserAgent = () => {
  const ua = navigator.userAgent.toLowerCase().toLocaleLowerCase();
  // 若是企微内核浏览器
  if (
    (ua.match(/micromessenger/i) && ua.match(/micromessenger/i)[0] === 'micromessenger') ||
    (ua.match(/wxwork/i) && ua.match(/wxwork/i)[0] === 'wxwork')
  ) {
    // 若是mac或windows系统浏览 返回true
    if (
      (ua.match(/mac/i) && ua.match(/mac/i)[0] === 'mac') ||
      (ua.match(/windows/i) && ua.match(/windows/i)[0] === 'windows')
    ) {
      return !0;
    }
  }
  return !1;
};

// 获取dom元素距离页面顶部高度
export const getElementToPageTop = el => {
  if (el.parentElement) {
    return getElementToPageTop(el.parentElement) + el.offsetTop;
  }
  return el.offsetTop;
};

// 获取dom元素距离页面左侧距离
export const getElementToPageLeft = el => {
  if (el.parentElement) {
    return getElementToPageTop(el.parentElement) + el.offsetLeft;
  }
  return el.offsetLeft;
};

// 用元素的getBoundingClientRect可以获取元素距离页面的距离。
// top和bottom则需要减去 html元素对象的上边框的宽度即clientTop而left和right则需减去clientLeft。
export const getElemDis = el => {
  let tp = document.documentElement.clientTop;
  let lt = document.documentElement.clientLeft;
  let rect = el.getBoundingClientRect();

  return {
    top: rect.top - tp,
    right: rect.right - lt,
    bottom: rect.bottom - tp,
    left: rect.left - lt,
  };
};

export function callbackUrl(destination) {
  return !destination
    ? ''
    : `${destination}/`.replace(/^https?:\/\/(.*?)(:\d+)?\/.*$/, '$1').replace(/\./g, '_');
}

// 获取路由第一级
export function getPathHeader() {
  const [, pathHeader] = window.location.pathname.split('/');
  return pathHeader;
}

export const isN = e => {
  return !!(e === null || e === '' || e === undefined);
};
