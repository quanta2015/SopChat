/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import store from 'store2';
import { Button,notification} from 'antd';
import { parse, stringify } from 'qs';
import { base,debug } from '@/conf';
import { url } from '@/services/service-utils.js';
import { request }  from '@/services/req';
import calendar from 'dayjs/plugin/calendar' 
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn') 
dayjs.extend(calendar)
dayjs.extend(relativeTime)


import icon_avatar from '@/imgs/icon-avatar.png';




export const findItem =(list,item,key,cb) => {
  list.map((o,i)=>{
    if (o[key] === item[key]) {
      cb(i,o)
    }
  })
}

export const getUniqueListBy=(arr, key)=> {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}


export const notify = (message,description,icon,cb) => {
  notification.open({
    message,
    description,
    icon: <img src={icon} />,
    btn: <Button type="primary" onClick={cb}>详情</Button>
  });
};

function getDateTimeStamp(dateStr) {
  return new Date(dateStr).getTime();
}

export function formatTime(dateStr) {
  var publishTime
  if (dateStr && dateStr.toString().length <= 10) {
    publishTime = dateStr
  } else if (dateStr && dateStr.toString().length > 10){
    publishTime = getDateTimeStamp(dateStr) / 1000
  }
  
    var d_seconds,
    d_minutes,
    d_hours,
    d_days,
    timeNow = parseInt(new Date().getTime() / 1000),
    d,
    date = new Date(publishTime * 1000),
    Y = date.getFullYear().toString().slice(2),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  d = timeNow - publishTime;
  
  if (H < 10) {
    H = "0" + H;
  }
  if (m < 10) {
    m = "0" + m;
  }
  if (s < 10) {
    s = "0" + s;
  }
  d_days = parseInt(d / 86400)
  d_hours = parseInt(d / 3600);
  d_minutes = parseInt(d / 60);
  d_seconds = parseInt(d);
  if (d_days > 0 && d_days < 3) {
    if(d_days == 1){
        return "昨天";
    }else if(d_days == 2){
        return "前天";
    }
  } else if (d_days <= 0 && d_hours > 0) {
    // return d_hours + "小时前";
    if (new Date().getHours() !==  d_hours && new Date().getHours() < d_hours) {
      return '昨天'
    } 
    return  H + ':' + m
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + "分钟前";
  } else if (d_seconds < 60) {
      return '刚刚'
  } else if (d_days >= 3 && d_days < 30) {
    return Y + "/" + M + "/" + D ;
  } else if (d_days >= 30) {
    return Y + "/" + M + "/" + D;
  }
}


// export const formatTime = (t)=> {return dayjs().to(t)}

export const log =(e,inf="debug")=>{
  if (debug) {
    console.log('%c%s: %o','color:blue;',inf,e);
    // console.dir(e, {depth: null, colors: true});
  }
}


export const parseFile =async(formVal)=>{
  const { avatar, id } = formVal;
  if (id && !avatar?.startsWith('http')) {
    const files = await request(
      `${url.file}/web/file/find?appCode=${formVal.appCode}&bizId=${formVal?.id}`,
    );

    if (files && files.length) {
      files.forEach(val => {
        const { formName, file } = val;
        formVal[formName] = file[0]?.url;
      });
    } else {
      formVal.avatar = icon_avatar;
    }
  }
}


export const insertMsg=(msg,str,el,setMsg)=>{
  let strPre  = msg.substring(0, el.current.selectionStart)
  let strTail = msg.substring(el.current.selectionStart, msg.length)
  setMsg(strPre + str + strTail)
}


export async function fileToBlob(file) {
    let drawable = await createImageBitmap(file)
    let  sw = drawable.width
    let  sh = drawable.height
    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');
    ctx.drawImage(drawable, 0, 0, sw, sh, 0, 0, sw, sh);

    let type = "image/jpeg"
    let blob = await new Promise(r => canvas.toBlob(r, type, .7));
    return  blob
}

export const scrollToBottom =(direction)=> {
  setTimeout(() =>{
    const el = document.getElementById("chatContent")
    if(el) {
      el.scrollTop = el.scrollHeight;
    }
  }, 100)
}

export const autoAuth = async()=>{
  let params = {
    client_id: "pre",
    client_secret: "pre",
    from: "normal",
    username: "13657086451",
    password: "4af29b04aba82d265b7a0a5cf14eb657",
  }
  let URL_LOGIN = `https://rhyy.pre.suosishequ.com/gateway/auth/oauth/token?${stringify(params)}`
  let ret = await axios(URL_LOGIN,{ method: 'GET' })


  let {accessToken, tokenHead} = ret.data.data
  let token = `${tokenHead}${accessToken}`
  window.token = window.token || token;
}


export function clone(v) {
  return JSON.parse(JSON.stringify(v))
}

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

export function listenPageChange({ history, dispatch }) {
  return url =>
    history.listen(({ pathname }) => {
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
  if (href.indexOf('/iframe') > -1 && url.indexOf('/iframe') === -1) {
    newUrl = newUrl.replace('/', `/iframe`);
  }

  return `${newUrl}${newParams}`;
};

/**
 * 根据路由地址 跳转时加上所属类前缀
 * @param {String} url: 要跳转的路由地址
 * @param options
 * spliceLen-pathName中末尾去除路由数量;
 * matchParams-pathname匹配到其中的路由后，舍弃后面的路由
 */
export const getComposeUrl = (url, options = { spliceLen: 0, matchParams: [] }) => {
  const { spliceLen = 0, matchParams = [] } = options;

  let _url = window.location.pathname.split(base)[1];
  const pathArr = _url.split('/');
  const urlArr = url.split('/');

  pathArr.splice(pathArr.length - spliceLen, spliceLen);
  let composeUrl = '';
  for (let i = 1; i < pathArr.length; i += 1) {
    let item = pathArr[i];
    if (matchParams.indexOf(item) > -1 || urlArr.indexOf(item) > -1) {
      break;
    }
    composeUrl = `${composeUrl}/${item}`;
  }
  return `${composeUrl}${url}`;
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
export const specialRegex = /[^\u4e00-\u9fa5a-zA-Z\d\s,.，。？?！；：:"“'+= 、…^\-*/'·～~@#¥$%&_!—「」【】《》()（）<>{}|[\]]+/;

// 常用工具方法集合
// 2017 / 03 / 07;

// export {
//   logger,
//   random,
//   uuid,
//   isEmpty,
//   serialize,
//   parseJSON,
// } from '@irim/saber';

/**
 * 解析URL search
 * @param  {string}  [str]      要解析的字符串
 * @param  {Boolean} [isDecode=true] 是否decode
 * @return {object}
 * @example
 * parseParam('aaa=1&bbb=2&ccc=3'); // { aaa: '1', bbb: '2', ccc: '3' }
 */
export function parseParam(str = location.search || location.href, isDecode = true) {
  const ary = str.split(/[?&]/);
  const result = {};
  // eslint-disable-next-line no-plusplus
  for (let i = 0, j = ary.length; i < j; i++) {
    const n = ary[i];
    // eslint-disable-next-line no-continue
    if (!n) continue;
    const tmp = n.split('=');
    result[tmp[0]] = isDecode && !!tmp[1] ? decodeURIComponent(tmp[1]) : tmp[1];
  }
  return result;
}

/**
 * 解析cookie
 * @return {object}
 */
export function parseCookie() {
  const cookieStr = window.document ? document.cookie : '';
  const cookieAry = cookieStr.split(/\s?;\s?/);
  const cookieMap = {};
  cookieAry.forEach(function(x) {
    const i = x.indexOf('=');
    if (i >= 0) {
      cookieMap[x.substring(0, i)] = x.substring(i + 1);
    }
  });
  return cookieMap;
}

/**
 * 从对象中解析出想要的值
 * @param {object} obj object
 * @param {string} key keys
 * @example
 * parseValue({ a: [{ b: 100 }] }, 'a.0.b'); // 100
 */
export function parseValue(obj, key) {
  if (!obj) return undefined;

  const keys = key.split('.');
  return keys.reduce((prev, curr) => {
    return (prev && prev[curr]) || undefined;
  }, obj);
}

let SEED = Math.round(Date.now() * Math.random());

/** 返回一个唯一的key */
export function uniqueKey() {
  // eslint-disable-next-line no-plusplus
  return `CC${(SEED++).toString(36).toUpperCase()}`;
}

/**
 * 保留几位小数点
 * @param {number} num
 * @param {number} [unit=2]
 */
export function toFixed(num, fix = 2) {
  // eslint-disable-next-line no-restricted-properties
  const unit = Math.pow(10, fix);
  return Math.round(num * unit) / unit;
}

/** 字符串排序 */
export function compare4ASCII(a, b) {
  if (!a && !b) return 0;
  // if (!isNaN(a) && !isNaN(b)) return a - b;
  if (typeof a === 'number' && typeof b === 'number') return a - b;

  // 没有内容应该放最后
  if (!a) return -1;
  if (!b) return 1;
  if (a === b) return 0;

  const aIsEN = /^[\w\s]+$/.test(a);
  const bIsEN = /^[\w\s]+$/.test(b);

  if (aIsEN && bIsEN) return a > b ? 1 : -1;
  if (aIsEN && !bIsEN) return -1;
  if (!aIsEN && bIsEN) return 1;

  if (String.prototype.localeCompare) {
    return String.prototype.localeCompare.call(a, b, 'zh');
  }

  return a > b ? 1 : -1;
}

export function getMenuData(routerMap, parentPath = '') {
  let routes = routerMap;
  if (routerMap['/']) {
    routes = routerMap['/'].children;
  }
  const menu = Object.keys(routes).map(path => {
    const result = {
      path: parentPath + path,
      name: routes[path].name,
      icon: routes[path].icon,
      authority: routes[path].authority,
      hidden: routes[path].hidden,
      activeMenu: routes[path].activeMenu,
    };
    if (routes[path].children) {
      result.children = getMenuData(routes[path].children, parentPath + path);
    }
    return result;
  });
  return menu;
}

export function getRouterData(routerMap) {
  const flattenRoute = flatten(routerMap);
  const routes = Object.keys(flattenRoute).map(path => flattenRoute[path]);
  return routes;
}

function flatten(routerMap, parentPath = '') {
  let routes = {};
  Object.keys(routerMap).forEach(path => {
    routes[parentPath + path] = {
      path: parentPath + path,
      key: path,
      name: routerMap[path].name,
      exact: routerMap[path].exact || true,
      component: routerMap[path].component,
      activeMenu: routerMap[path].activeMenu,
      configPath: routerMap[path].path,
    };
    if (routerMap[path].children) {
      routes = {
        ...routes,
        ...flatten(routerMap[path].children, path === '/' ? '' : parentPath + path),
      };
    }
  });
  return routes;
}

export const ENV = (document.querySelector('meta[name="x-server-env"]') || { content: 'test' })
  .content;

// 重定向到登录
// export const gotoLogin = (path, isSelect) => {
//   window.location.href = `http${
//     ENV === 'production'
//       ? 'https://manager.suosihulian.com'
//       : 'http://manage-container.community-sit.easyj.top'
//   }/${!isSelect ? 'user/login' : 'select'}?destination=${encodeURIComponent(
//     path || window.location.href,
//   )}`;
// };

/**
 * 在后端存在脏数据的情况下，为列表数据加上唯一key
 * @param data object 请求返回的数据
 * @param data.dataSource array
 * @param data.pagination object
 * @returns object
 */
export const getUniqueData = data => {
  const { dataSource = [], pagination } = data || {};
  return {
    dataSource: dataSource.map((item, index) => ({
      ...item,
      uniqueId: pagination?.pageSize * (pagination?.pageNo - 1) + index + 1,
    })),
    pagination,
  };
};
