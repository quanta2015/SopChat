import axios from 'axios';

export default function withCodeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    return axios({
      url,
      // withCredentials: true,
      ...options,
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(response => {
        const { data } = response;
        reject(data);
      });
  });
}
