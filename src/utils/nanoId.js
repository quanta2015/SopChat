import nanoid from 'nanoid';
import { message } from 'antd';

/**
 * 生成id
 * @param {String} str：参数 前缀字符
 * @param {Number} len：参数 生成id的最终长度
 * @param {String} 返回值： 指定长度字符串
 */
const setNanoId = ({ str = '', len = 10 } = {}) => {
  const idLength = len - str.trim().length;

  if (idLength <= 0) {
    message.warning(`${str || 'id'}配置信息有误`);
    return null;
  }

  const id = nanoid(len);
  return `${str}${id}`;
};

/**
 * 生成id
 * @param {String} str：参数 前缀字符
 * @param {Number} len：参数 生成id的最终长度
 * @param {String} 返回值： 指定长度字符串
 */
const generateId = ({ str = '', len = 21 } = {}) => {
  const idLength = len - str.trim().length;

  if (idLength <= 0) {
    message.warning(`${str || 'id'}配置信息有误`);
    return null;
  }

  const id = nanoid(len);
  return `${str}${id}`;
};

export { setNanoId, generateId };
