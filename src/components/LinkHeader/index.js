import React from 'react';
import { Divider } from 'antd';
import styles from './style.less';

export default function LinkHeader(props) {
  const { title, content, contentClick } = props;

  return (
    <div className={styles.linkHeader}>
      <Divider type="vertical" className={styles.line} />
      <div className={styles.linkTitle}>{title}</div>
      {content ? (
        <div className={styles['link-header-content']} onClick={contentClick}>
          {content}
        </div>
      ) : null}
    </div>
  );
}
