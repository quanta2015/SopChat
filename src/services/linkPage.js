import { parse } from 'qs';
import request from './request.js';
import { url } from './service-utils.js';

/**
 * ----------------------------链接套壳----------------------------
 */
export function getMessagelist(data) {
  return request(`${url.lltk}/mobile/link/page`, {
    method: 'post',
    data,
  });
}

export function deleteMessage(idList) {
  return request(`${url.lltk}/mobile/link/delete`, {
    method: 'post',
    data: {
      idList,
    },
  });
}

export function getDefaultValueTitle(_url) {
  return request(`${url.lltk}/mobile/link/defaultValueTitle?url=${_url}`);
}

export function getDefaultValueImage() {
  return request(`${url.lltk}/mobile/link/defaultValueImage`);
}

export function getFormColumn() {
  return request(`${url.lltk}/mobile/link/getFormColumn`);
}

export function getUrlsString(groupId) {
  return request(`${url.file}/web/file/getUrlsString?groupId=${groupId}`);
}

/**
 * ----------------------------运营机器人----------------------------
 */

export function getWelcomText() {
  return request(`${url.lltk}/operation/robot/web/welcome`);
}

export function sendChangeMedia(fileUrl) {
  return request(`${url.lltk}/operation/robot/web/sendChangeMedia?fileUrl=${fileUrl}`);
}

export function getRobotMessageList(keyword) {
  return request(`${url.lltk}/operation/robot/web/getMessage`, {
    method: 'post',
    data: {
      search: {
        keyword,
      },
    },
  });
}

export function getUserInfo() {
  return request(`${url.auth}/oauth/loginInfo`);
}

export function getMediaId(data) {
  const search = parse(window.location.search.slice(1)) || {};

  return request(`${url.lltk}/operation/robot/web/sendChangeMedia`, {
    method: 'post',
    data: {
      ...data,
      appCode: 'yyjqr',
      corpId: search.corpid,
    },
  });
}

/**
 * ----------------------------客户资料----------------------------
 */

export function getGroupMemberDetail() {
  const { corpId, externalUserId, unionId } = window;
  const prefix = `${url.usercenter}/web/maternal/user/unionid/detail?corpId=${corpId}`;
  const detailUrl = unionId ?  `${prefix}&unionid=${unionId}` : `${prefix}&externalUserId=${externalUserId}`;

  return request(detailUrl);
}

export function getRelationWeChatView() {
  return request(`${url.group}/app/group/member/customer/getRelationWeChatView`);
}

export function updateGroupMemberLabelView() {
  return request(`${url.usercenter}/web/maternal/viwe/getFormColumn`);
}
// export function findImg(id) {
//   return request(`${url.file}/web/file/find?appCode=khzl&bizId=${id}`);
// }
export function updateGroupMemberLabel(data) {
  const params = window.unionId ? {
    ...data,
    corpId: window.corpId,
    unionid: window.unionId,
  } : {
    ...data,
    corpId: window.corpId,
    externalUserId: window.externalUserId,
  };

  return request(`${url.group}/app/group/member/customer/updateGroupMemberLabel`, {
    method: 'post',
    data: params,
  });
}

export function getRegion(id) {
  return request(`${url.group}/app/group/member/customer/getRegionCode?id=${id}`);
}

/**
 * ----------------------------话术库1.1----------------------------
 */

export function getSpeechList(keyword = '', columnId, pageNo = 1) {
  return request(`${url.hsk}/web/hs/desktop/page`, {
    method: 'post',
    data: {
      columnId,
      appCode: 'hsk',
      pageNo,
      pageSize: 20,
      search: {
        keyword,
      },
    },
  });
}

// export function getSpeechList(keyword = '') {
//   return request(`${url.hsk}/web/hs/desktop/page`, {
//     method: 'post',
//     data: {
//       // columnId,
//       appCode: 'hsk',
//       pageNo: 1,
//       pageSize: 20,
//       search: {
//         keyword,
//       },
//     },
//   });
// }

export function getListByColumnId() {
  return request(`${url.publicity}/web/columns/tree/listByColumnId?appCode=hsk&columnId=0`);
}

export function sendSpeechNews(id) {
  const { unionId = 'wmsMNEDgAATjEjUG2qcGzp4U19ci97mw' } = window;
  return request(`${url.hsk}/web/news/send?id=${id}&unionId=${unionId}`);
}

export function getFileDetail(appCode, id) {
  return request(`${url.file}/web/file/find?bizId=${id}&appCode=${appCode}`);
}

// ===================================卓盟发送消息============================================
// 发送文本
export function sendTextNews(content, msgSource) {
  const { wxId, senderName, conversationId, unionIdOrChatId, senderUserId,corpId } = window;

  if (wxId && conversationId && unionIdOrChatId) {
    return request(`${url.zhuomenApiUrl}api/msg/text`, {
      method: 'POST',
      data: {
        wxId,
        content,
        conversationId,
        unionIdOrChatId,
        msgSource,
        senderName,
        senderUserId,
        corpId,
      },
    });
  }

  return Promise.reject();
}

// 发送图片
export function sendImgNews(fileUrl, msgSource) {
  const { wxId, senderName, conversationId, unionIdOrChatId, senderUserId,corpId } = window;

  if (wxId && conversationId && unionIdOrChatId) {
    return request(`${url.zhuomenApiUrl}api/msg/image`, {
      method: 'POST',
      data: {
        wxId,
        fileUrl,
        conversationId,
        unionIdOrChatId,
        senderName,
        msgSource,
        senderUserId,
        corpId,
      },
    });
  }

  return Promise.reject();
}

// 发送图文消息

export function sendImgTextNews(title, desc, link, imgUrl, msgSource) {
  const { wxId, conversationId, unionIdOrChatId, senderName, senderUserId,corpId } = window;

  if (wxId && conversationId && unionIdOrChatId) {
    return request(`${url.zhuomenApiUrl}api/msg/link`, {
      method: 'POST',
      data: {
        wxId,
        title,
        desc,
        url: link,
        imageUrl: imgUrl,
        conversationId,
        unionIdOrChatId,
        senderName,
        msgSource,
        senderUserId,
        corpId,
      },
    });
  }

  return Promise.reject();
}

// 发送文件
export function sendFileNews(fileUrl, msgSource) {
  const { wxId, conversationId, unionIdOrChatId, senderName, senderUserId,corpId } = window;

  if (wxId && conversationId && unionIdOrChatId) {
    if (/\.(mp4|MP4)$/.test(fileUrl)) {
      return request(`${url.zhuomenApiUrl}api/msg/video`, {
        method: 'POST',
        data: {
          wxId,
          conversationId,
          fileUrl,
          unionIdOrChatId,
          senderName,
          msgSource,
          senderUserId,
          corpId,
        },
      });
    }

    return request(`${url.zhuomenApiUrl}api/msg/file`, {
      method: 'POST',
      data: {
        wxId,
        conversationId,
        fileUrl,
        unionIdOrChatId,
        senderName,
        msgSource,
        senderUserId,
        corpId,
      },
    });
  }

  return Promise.reject();
}

export function sendMiniAppNews(Ghid, Enterpoint, msgSource, title, appid, imgUrl) {
  const { wxId, conversationId, senderName, senderUserId,corpId } = window;

  if (wxId && conversationId) {
    return request(`${url.zhuomenApiUrl}api/msg/miniProgram`, {
      method: 'POST',
      data: {
        wxId,
        Ghid,
        Enterpoint,
        conversationId,
        senderName,
        msgSource,
        senderUserId,
        title,
        appid,
        imgUrl,
        corpId,
      },
    });
  }

  return Promise.reject();
}

export function getNewsDetail(id, columnId) {
  return request(`${url.cms}/mobile/news/detail?id=${id}&columnId=${columnId}`);
}

/**
 * ----------------------------营销策略1.1----------------------------
 */

export function getStrategyList(invalid, keyword = '') {
  return request(`${url.crm}/desktop/task/page`, {
    method: 'POST',
    data: {
      pageNo: 1,
      pageSize: 20,
      invalid,
      unionId: window.unionId,
      chatId: window.chatId,
      conversationId: window.conversationId,
      wxId: window.wxId,
      search: {
        keyword,
      },
    },
  });
}

export function getEffectStrategyList(invalid, keyword = '') {
  return request(`${url.crm}/desktop/task/pageState`, {
    method: 'POST',
    data: {
      pageNo: 1,
      pageSize: 20,
      invalid,
      unionId: window.unionId,
      chatId: window.chatId,
      conversationId: window.conversationId,
      wxId: window.wxId,
      search: {
        keyword,
      },
    },
  });
}

export function getTaskList(keyword = '') {
  return request(
    `${url.task}/web/workflow/chat-task/list?keyword=${keyword}&appCode=yxgl&pageSize=20&conversationId=${window.conversationId}`,
    {
      method: 'GET',
    },
  );
}
