import React, { useState, useEffect } from 'react';
import { SelectFormUser, ComposeForm } from 'suo-web-all';
import { Spin } from 'antd';
import { nanoid } from 'nanoid';
import styles from './style.less';
import request from '@/services/request.js';
import { url } from '@/services/service-utils.js';
import {  updateGroupMemberLabel, getUserInfo } from '@/services/linkPage';
import { toJS } from 'mobx'
import { log } from '@/utils/common'
import comsMap from './coms-map';

import LinkHeader from '@/components/LinkHeader';
import UserDetail from '@/components/UserDetail';
import CmsDivider from '@/components/CmsDivider';
import EdditModal from './EdditModal';

import male from '@/imgs/client.svg';
import femal from '@/imgs/femal.svg';
import unknow from '@/imgs/unknow.svg';
import babyImg from '@/imgs/baby.svg';

import icon_avatar from '@/imgs/icon-avatar.png';
import ImageAvatar from './ImageAvatar.js';

const userTypeData = {
  '1': '未知',
  '2': '备孕',
  '3': '孕妇',
  '4': '宝妈',
};

const sexData = {
  '1': male,
  '2': femal,
  '0': unknow,
};

export default function Client({store}) {

  const [useDetail, setUserDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isEddit, setIsEddit] = useState(true);
  const [control, setControl] = useState([]);

  const selectUserProps = {
    showTabList: ['customerTagContacts'],
    userOrigin: url?.usercenter,
    unCheckableNodeType: ['ORG'],
    isSaveSelectSignature: false,
    wrapperKey: 'customerTagInfoList',
    multiple: true,
    requestParams: {
      selectTypeList: ['tag'],
      tagTypeList: [1],
      noTagLabelPermission: false,
    },
    target: 'tool',
    modalWidth: 300,
    selectType: 'dept',
    searchPlaceholder: '请选择',
    noTagLabelPermission: false,
    dialogProps: {
      title: '请选择',
    },
  };

  useEffect(() => {
    store.initClient().then(r=>{
      setUserDetail(r.detail)
      setControl(r.control)
      const { customerSyncSwitch } = store.user
      setIsEddit(customerSyncSwitch !== 1)
    })
  }, [visible,store.chatRel]);

  const handleChange = value => {
    setLoading(true);
    updateGroupMemberLabel({ labelSignature: value })
      .then(() => {
        getDetail();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleContentClick = () => {
    setVisible(true);
  };

  const filterControls = () => {
    const filterItem = ['sex', 'alias', 'userType'];

    return control.filter(item => {
      return !filterItem.includes(item.name);
    });
  };

  const isShowUserInfo = val => {
    return control.findIndex(item => item.name === val) !== -1;
  };

  return (
    <div className={styles.client}>
      {/* 客户资料 */}
      <Spin spinning={loading}>
        <div className="client-info">
          <LinkHeader title="客户资料" />

          <UserDetail
            userImg={useDetail?.avatar || ''}
            title={(isShowUserInfo('alias') && useDetail?.alias) || ''}
            tagContent={
              isShowUserInfo('userType') && useDetail?.userType
                ? `用户类型：${userTypeData[useDetail?.userType]}`
                : ''
            }
            smallImg={isShowUserInfo('sex') && sexData[useDetail?.sex]}
            handleClick={handleContentClick}
            eddit
          />

          <CmsDivider />

          {!visible && (
            <ComposeForm
              controls={filterControls()}
              comsMap={comsMap}
              hideRequiredMark
              labelCol={{ span: 8 }}
              labelAlign="left"
              value={useDetail}
              key={nanoid()}
            />
          )}
        </div>

        {/* 客户标签 */}
        <div className="client-tag">
          <LinkHeader title="客户标签" />
          <div className="select-form-user">
            <SelectFormUser
              onChange={v => handleChange(v)}
              value={useDetail.labelList}
              wrapperKey="customerTagInfoList"
              selectUserProps={selectUserProps}
              confirmTitle="确认要删除选中标签吗？"
            />
          </div>
          <div className="tips">备注：可点击删除或编辑修改</div>
        </div>

        {/* 关联宝宝 */}

        {useDetail?.userBabyList?.length > 0 && (
          <div className="baby-connect">
            <LinkHeader title="关联宝宝" />
            <div className="connect-content">
              {useDetail?.userBabyList?.map(item => {
                return (
                  <div className="item" key={item.babyRelation}>
                    <img src={babyImg} alt="" />
                    <div className="right">
                      <div className="name">
                        <div className="ellipsis">{item?.realName}</div>
                        <img src={sexData[`${useDetail?.sex}`]} alt="" />
                        <div className="relation">({item?.babyRelationDesc})</div>
                      </div>
                      <div className="info ellipsis">生日:{item?.birthday || '-'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 关联微信 */}
        {useDetail?.memberList?.length > 0 && (
          <div className="client-connect">
            <LinkHeader title="关联微信" />
            <div className="connect-content">
              {useDetail?.memberList?.map((item,i) => {
                return (
                  <div key={item.id} className="item">
                    <ImageAvatar key={i} id={item.id} avatar={item.avatar} appCode="mytxl" />
                    <div className="right">
                      <div className="name">
                        <div>{item.realName}</div>
                        <div>({item?.relationDesc})</div>
                      </div>
                      <div className="info">{item?.openId}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Spin>

      {visible ? (
        <EdditModal
          eddit={isEddit}
          id={useDetail?.id}
          appCode={useDetail?.appCode}
          onCloseModal={() => {
            setVisible(false);
          }}
        />
      ) : null}
    </div>
  );
}
