import React from 'react';
import { Tag } from 'antd';

import styles from './style.less';

export default function UserDetail(props) {
  const { userImg, title, tagContent, smallImg, eddit = false, handleClick } = props;

  return (
    <div className={styles.user}>
      <div className="left">
        <div className="img">
          <img src={userImg} alt="" />
        </div>
      </div>
      <div className="right">
        <div className="user-detail">
          <div className="top">
            <div className="user-title">
              <div className="user-name ellipsis">{title}</div>
              {smallImg && (
                <div className="userImg">
                  <img src={smallImg} alt="" />
                </div>
              )}
            </div>
            {eddit && (
              <div className="btn-eddit" onClick={handleClick}>
                编辑
              </div>
            )}
          </div>
          {tagContent && tagContent !== '用户类型：未知' && (
            <Tag color="#EFF6FD" className="user-tag" title={tagContent}>
              {tagContent}
            </Tag>
          )}
        </div>
      </div>
    </div>
  );
}
