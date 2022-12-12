import request from '@/services/withCodeRequest';
import conf from '../conf';
const { base } = conf;

async function fetchEnv() {
  return request('conf.json', {
    method: 'GET',
  });
}
// const urlCollect = await fetchEnv();

document.querySelector('meta[name="x-server-env"]').setAttribute('content', "pre");

export const ENV = "pre";
export const  url  = {
    "auth": "https://rhyy.pre.suosishequ.com/gateway/auth",
    "collect": "https://rhyy.pre.suosishequ.com/gateway/collect-form",
    "receipt": "https://rhyy.pre.suosishequ.com/gateway/receipt",
    "wish": "https://rhyy.pre.suosishequ.com/gateway/micro-wish",
    "usercenter": "https://rhyy.pre.suosishequ.com/gateway/user-center",
    "permission": "https://rhyy.pre.suosishequ.com/gateway/permission-center",
    "homework": "https://rhyy.pre.suosishequ.com/gateway/game",
    "operation": "https://rhyy.pre.suosishequ.com/gateway/operation",
    "equipment": "https://rhyy.pre.suosishequ.com/gateway/equipment",
    "game": "//funlowcodeplat.community-sit.easyj.top",
    "cms": "https://rhyy.pre.suosishequ.com/gateway/cms",
    "mock": "//yapi.sitops.suosihulian.com/mock/54",
    "file": "https://rhyy.pre.suosishequ.com/gateway/file-center",
    "workflow": "https://rhyy.pre.suosishequ.com/gateway/workflow",
    "activity": "https://rhyy.pre.suosishequ.com/gateway/activity",
    "publicity": "https://rhyy.pre.suosishequ.com/gateway/publicity",
    "workflow-mobile": "https://rhyy.pre.suosishequ.com/gateway/workflow/mobile",
    "group": "https://rhyy.pre.suosishequ.com/gateway/group",
    "workbench": "https://rhyy.pre.suosishequ.com/gateway/workbench",
    "external": "https://rhyy.pre.suosishequ.com/gateway/external-service",
    "notice": "https://rhyy.pre.suosishequ.com/gateway/notice",
    "circles": "https://rhyy.pre.suosishequ.com/gateway/circles",
    "worknews": "https://rhyy.pre.suosishequ.com/gateway/work-news",
    "task": "https://rhyy.pre.suosishequ.com/gateway/task",
    "hsk": "https://rhyy.pre.suosishequ.com/gateway/hsk",
    "tag": "https://rhyy.pre.suosishequ.com/gateway/crm",
    "crm": "https://rhyy.pre.suosishequ.com/gateway/crm",
    "interaction": "https://rhyy.pre.suosishequ.com/gateway/interaction",
    "zhuomenApiUrl": "//pt-qa.lbian.cn/"
  }



export const getPathnameBybase = () =>
  base === '/' ? window.location.pathname : window.location.pathname.split(base)[1];
