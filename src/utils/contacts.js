/* eslint-disable import/prefer-default-export */
import React from 'react';

/**
 * 设置(校内、区县)通讯录人员管理表头
 * @param {Array<Object>} attributeInfos: 表头属性列表
 * @param {Object} other: 额外自定义列，
 */
export const setPersonnelTableHeader = ({ attributeInfos = [], other }) => {
  if (!attributeInfos || attributeInfos.length <= 0) {
    return [];
  }

  // 遍历设置table表头属性值
  const headers = attributeInfos.map(attributeInfo => {
    const { sign, name } = attributeInfo;

    const newAttrInfo = {
      ...attributeInfo,
      title: name,
      dataIndex: sign,
      key: sign,
      visible: true,
      width: 120,
    };

    // 设置用户名样式
    if (sign === 'userName') {
      newAttrInfo.width = 150;
      newAttrInfo.render = text => <div className="table-th-icon">{text}</div>;
    }

    if (sign === 'deptList') {
      newAttrInfo.width = 200;
    }

    // if (index === 0) {
    //   newAttrInfo.fixed = 'left';
    // }

    return newAttrInfo;
  });

  // 添加操作列
  if (other) {
    headers.push(other);
  }

  return headers;
};

/**
 * 设置(校内、区县)通讯录人员管理表格数据列表
 * @param {Array<Object>} userData:表格数据
 */
export const setPersonnelTableData = ({ userData = [] }) => {
  if (!userData || userData.length <= 0) {
    return [];
  }

  // 遍历数组
  return userData.map(detail => {
    // 遍历每条数据的key值 重组数据
    const newDetail = Object.keys(detail).reduce((detailItem, attrKey) => {
      const thisDetail = detailItem;
      const attrValue = detail[attrKey];

      // 将部门列表统一
      if (attrKey === 'deptList' && attrValue.length > 0) {
        thisDetail[attrKey] = attrValue.map(({ name = '' }) => name).join('、');
        thisDetail.depts = attrValue;
        return thisDetail;
      }

      // 联系方式和扩展属性值是Array<Object>
      if (Array.isArray(attrValue) && attrValue.length > 0) {
        attrValue.forEach(({ key, value }) => {
          if (!key || !value) {
            return;
          }
          // 联系方式

          thisDetail[key] = value;
        });
        return thisDetail;
      }

      // 对象类型数据整理
      if (Object.prototype.toString.call(attrValue) === '[object Object]') {
        Object.keys(attrValue).forEach(attrListKey => {
          if (attrKey === 'contacts') {
            thisDetail[attrListKey] = attrValue[attrListKey].mobile;
            return;
          }

          thisDetail[attrListKey] = attrValue[attrListKey];
        });
      }

      // 其他属性直接赋值
      thisDetail[attrKey] = attrValue;
      return thisDetail;
    }, {});

    return newDetail;
  });
};
