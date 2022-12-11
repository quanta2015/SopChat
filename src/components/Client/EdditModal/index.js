/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { ComposeForm } from 'suo-web-all';
import request from '@/services/request.js';
import { updateGroupMemberLabelView } from '@/services/linkPage';
import { url } from '@/services/service-utils';

import backIcon from '@/imgs/back.svg';

import styles from './style.less';

export default function Eddit(props) {
  const { id, onCloseModal, appCode,eddit } = props;
  const [controls, setControls] = useState([]);

  const params = window.unionId ? { 
    corpId: window.corpId,
    unionid: window.unionId,
  } : {
    corpId: window.corpId,
    externalUserId: window.externalUserId,
  }

  useEffect(() => {
    updateGroupMemberLabelView().then(res => {
      const newControls = res.dataSource.map(item => {
        const { uiType,name } = item;
        if (uiType === 'upload-img') {
          return {
            ...item,
            props: {
              appCode,
              requestUrl: url.file,
              maxCount: 1,
              maxSize: 20,
              disabled:!eddit,
              tips: (
                <div>
                  <div>推荐尺寸：72 x 72px</div>
                  <div style={{ marginTop: 8 }}>图片格式必须为：jpeg、jpg、png，不可大于10M</div>
                </div>
              ),
            },
          };
        }

        if (uiType === 'select-search') {
          return {
            ...item,
            props: {
              ...item.props,
              disabled:!eddit,
              api: `${url.group}/app/group/member/customer/search`,
              initApi: `${url.group}/app/group/member/customer/getRegionCode`,
            },
          };
        }

        if(name === "remark") {
          return {
            ...item,
            props:{
              ...item.props,
              placeholder: '请输入',
            },
          }
        }

        return {
          ...item,
          props: {
            ...item.props,
            disabled:!eddit,
            placeholder: '请输入',
          },
        };
      });

      setControls(newControls);
    });
  }, []);

  const formProps = {
    controls,
    toastGlobalError: true,
    request: {
      url: `${url.usercenter}/web/maternal/user/updateOne`,
      method: 'POST',
      params: {
       ...params,
       id,
      },
    },
    initialValuesRequest: {
      url: `${url.usercenter}/web/maternal/user/unionid/detail`,
      method: 'GET',
      params,
    },
    dataFormatAfterInit: async values => {
      const { id: _id, appCode: _appCode, avatar } = values;
      const newValue = { ...values, avatar: avatar * 1 === 0 ? '' : avatar };
      if (_id) {
        const files = await loadFiles();
        if (files && files.length) {
          files.forEach(val => {
            const { formName, groupId } = val;
            newValue[formName] = groupId;
          });
        }
      }
      return newValue;

      async function loadFiles() {
        const file = await request(`${url.file}/web/file/find?appCode=${_appCode}&bizId=${_id}`);
        return file;
      }
    },
    initialValues: {
      sex: 1,
    },
    actions: [
      {
        uiType: 'button',
        props: {
          children: '取消',
          'data-submit-action': 'goBack',
          onClick: () => {
            onCloseModal();
          },
        },
      },
      {
        uiType: 'submit',
        props: {
          children: '确定',
          type: 'primary',
          'data-submit-action': 'refresh',
        },
      },
    ],
    dataFormatBeforeSubmit: formValue => {
      const newValue = { ...formValue };
      controls.forEach(val => {
        if (val.uiType === 'upload-img') {
          newValue[val.name] = newValue[val.name] === 0 ? '' : newValue[val.name];
        }
      });

      return newValue;
    },
    onFinish(form, btnTarget) {
      const { submitAction } = btnTarget.dataset;

      if (submitAction === 'goBack') {
        form.resetFields();
        return;
      }
      if (submitAction === 'refresh') {
        onCloseModal();
        form.resetFields();
      }
    },
  };

  return (
    <div className={styles['eddit-modal']}>
      <div className={styles.title} onClick={onCloseModal}>
        <img src={backIcon} alt="" />
        <span>编辑客户资料</span>
      </div>
      <ComposeForm {...formProps} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} />
    </div>
  );
}
