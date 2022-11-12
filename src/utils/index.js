/* eslint-disable import/prefer-default-export */
import store from 'store2';
/**
 * 根据路由地址 将 v2替换成 v2/iframne
 * @param {String} url: 要跳转的路由地址
 * @param {String} params: 参数
 */
export const getIframeUrl = (url, params) => {
  let newUrl = url;
  const { href } = window.location;
  if (href.indexOf('/v2/iframe') > -1 && url.indexOf('/v2/iframe') === -1) {
    newUrl = newUrl.replace('/v2', '/v2/iframe');
  }

  return `${newUrl}${!params ? '' : params}`;
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

/* eslint-disable import/prefer-default-export */
/**
 *
 * 深度遍历
 * @param {Array} list: 传入的数据集合
 * @param {Object} parentItem: 父节点数据
 * @param {Function} func：处理数据的方法
 */
export function loopArray({ list, parentItem }, func) {
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];

    const next = func(item, parentItem);
    if (next.result !== null) {
      loopArray({ list: next.result, parentItem: next.parentItem }, func);
    }
  }
}
