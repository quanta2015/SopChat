import request from '@/services/withCodeRequest';
import conf from '../conf';
const { base } = conf;

async function fetchEnv() {
  return request('/rhyysshl/pc/conf.json', {
    method: 'GET',
  });
}
const urlCollect = await fetchEnv();

document.querySelector('meta[name="x-server-env"]').setAttribute('content', urlCollect.mode);

export const ENV = urlCollect.mode;
export const { url } = urlCollect;

export const getPathnameBybase = () =>
  base === '/' ? window.location.pathname : window.location.pathname.split(base)[1];
