import React, { useEffect } from 'react';
import { observer, inject, history,connect } from 'umi';
import { stringify } from 'qs';
import axios from 'axios'


// const env = "sit"
// const params = {
//   client_id: env,
//   client_secret: env,
//   from: "normal",
//   username: "13657086451",
//   password: "1bfc68f2d19c9b1e06cd466906e1b4a5",
// }
// const SERVER = `https://front.sit.suosihulian.com`

// const env = "pre"
// const params = {
//   client_id: env,
//   client_secret: env,
//   from: "normal",
//   username: "13657086451",
//   password: "4af29b04aba82d265b7a0a5cf14eb657",
// }
// const SERVER = `https://rhyy.pre.suosishequ.com`
// const LOGIN  = `${SERVER}/gateway/auth/oauth/token?${stringify(params)}`

const Auth = ({index}) => {
  const store = index
  
  store.login().then(() => {
    history.push('/sop')
  });
  
  // axios(LOGIN,{ method: 'GET' }).then((ret)=>{
  //   let token = `${ret.data.data.tokenHead}${ret.data.data.accessToken}`
  //   // console.log(token)
  //   window.token = window.token || token;
  //   history.push('/sop')
  // })

  return null
};

export default inject('index')(observer(Auth))
