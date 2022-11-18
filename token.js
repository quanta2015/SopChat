var axios = require('axios');
var qs = require('qs');

const {stringify}= qs

let params = {
  client_id: "pre",
  client_secret: "pre",
  from: "normal",
  username: "13657086451",
  password: "4af29b04aba82d265b7a0a5cf14eb657",
}


const autoAuth = async()=>{
  let params = {
    client_id: "pre",
    client_secret: "pre",
    from: "normal",
    username: "13657086451",
    password: "4af29b04aba82d265b7a0a5cf14eb657",
  }
  let URL_LOGIN = `https://rhyy.pre.suosishequ.com/gateway/auth/oauth/token?${stringify(params)}`
  let ret = await axios(URL_LOGIN,{ method: 'GET' })


  let {accessToken, tokenHead} = ret.data.data
  let token = `${tokenHead}${accessToken}`
  console.log(token)
}

autoAuth()

