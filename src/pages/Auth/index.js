import React, { useEffect } from 'react';
import { stringify } from 'qs';
import { history } from 'umi';
import axios from 'axios'

const params = {
  client_id: "pre",
  client_secret: "pre",
  from: "normal",
  username: "13657086451",
  password: "4af29b04aba82d265b7a0a5cf14eb657",
}
const SERVER = `https://rhyy.pre.suosishequ.com`
const LOGIN  = `${SERVER}/gateway/auth/oauth/token?${stringify(params)}`

const Auth = () => {
  useEffect(() => {
    axios(LOGIN,{ method: 'GET' }).then((ret)=>{
      let token = `${ret.data.data.tokenHead}${ret.data.data.accessToken}`
      // console.log(token)
      window.token = window.token || token;
      history.push('/sop')
    })
  })

  return null
};

export default Auth
