import React, { useState, useEffect } from 'react';
import { observer, inject, history,connect,Navigate } from 'umi';
import { stringify } from 'qs';
import axios from 'axios'


const Auth = () => {
  
  useEffect(() => {
    let params = {
      client_id: "pre",
      client_secret: "pre",
      from: "normal",
      username: "13657086451",
      password: "4af29b04aba82d265b7a0a5cf14eb657",
    }
    let URL_LOGIN = `https://rhyy.pre.suosishequ.com/gateway/auth/oauth/token?${stringify(params)}`
    axios(URL_LOGIN,{ method: 'GET' }).then((ret)=>{
      let {accessToken, tokenHead} = ret.data.data
      let token = `${tokenHead}${accessToken}`
      window.token = window.token || token;
      console.log(token)
    })
    
  }, []);


  return (
    <Navigate to="/index" />
  );
};

export default Auth
