import React, { useState, useEffect } from 'react';
import request from '@/services/request.js';
import { url } from '@/services/service-utils.js';
import avatarPNg from '@/imgs/icon-avatar.png';

export default function ImageAvatar({ id, appCode, avatar }) {
  const [img, setImg] = useState('');
  useEffect(() => {
    getDetail();
  }, [id]);
  const getDetail = async () => {
    const newFormValue = {};

    if (id && !avatar?.startsWith('http')) {
      const files = await request(`${url.file}/web/file/find?appCode=${appCode}&bizId=${id}`);

      if (files && files.length) {
        files.forEach(val => {
          const { file } = val;
          newFormValue.avatar = file[0]?.url;
        });
      } else {
        newFormValue.avatar = avatarPNg;
      }
    } else {
      newFormValue.avatar = avatar;
    }
    setImg(newFormValue?.avatar);
  };

  return <img src={img || avatarPNg} alt="" />;
}
