import './global.less'

// import { getDvaApp } from 'umi';
// // import './public-path';
// import store from 'store2';
// // import routes from '../config/router.config';
// // import { queryCurrent } from './services/user';


// // window.token =
// //   window.token ||
// //   `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRndld29yay5xcGljLmNuJTJGd3dwaWMlMkY5MzI5NTFfUnZXVFVrY3NRXzZ5eFdsXzE2NjgzODc0MzElMkYwJTIyJTJDJTIyaW5kdXN0cnlUeXBlJTIyJTNBJTIybXl0eGwlMjIlMkMlMjJsb2dpblR5cGUlMjIlM0ElMjJub3JtYWwlMjIlMkMlMjJtZW1iZXJJZCUyMiUzQTE1MjIyMDM1NTExOTUyNzUzNTAlMkMlMjJtZW1iZXJOYW1lJTIyJTNBJTIyJUU2JTlEJThFJUU1JUJCJUJBJUU1JUJEJUFDJTIyJTJDJTIybW9iaWxlJTIyJTNBJTIyMTM2NTcwODY0NTElMjIlMkMlMjJvcmdJZCUyMiUzQTMzMDEwMDEwMDAwMDUlMkMlMjJvcmdOYW1lJTIyJTNBJTIyJUU2JTlEJUFEJUU1JUI3JTlFJUU2JTg5JTgwJUU2JTgwJTlEJUU0JUJBJTkyJUU4JUJGJTlFJUU3JUE3JTkxJUU2JThBJTgwJUU2JTlDJTg5JUU5JTk5JTkwJUU1JTg1JUFDJUU1JThGJUI4JTIyJTJDJTIyb3JnVHlwZSUyMiUzQSUyMmdlbmVyYWwlMjIlMkMlMjJyZWdpb25Db2RlJTIyJTNBJTIyMzMwMTAwMDAwMDAwMDAwMDAwJTIyJTJDJTIyc2hvcnROYW1lJTIyJTNBJTIyJUU5JUEyJTg0JUU1JThGJTkxJUU3JThFJUFGJUU1JUEyJTgzJTIyJTJDJTIyc291cmNlJTIyJTNBJTIyaW50ZXJuYWwlMjIlMkMlMjJ1c2VySWQlMjIlM0ExNTIyMjAzNTUxMTk1Mjc1MzUwJTJDJTIydXNlck5hbWUlMjIlM0ElMjIlRTYlOUQlOEUlRTUlQkIlQkElRTUlQkQlQUMlMjIlMkMlMjJ1c2VyVHlwZSUyMiUzQSUyMmVtcGxveWVlJTIyJTdEIiwidXNlcl9uYW1lIjoiMTM2NTcwODY0NTE7O25vcm1hbCIsIm9yZ19pZCI6MzMwMTAwMTAwMDAwNSwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTY2ODc4MDk0NywianRpIjoiYjBjYTM1OTItYjZmNy00MDY2LTkyYzctMDRhNGU4NmFmN2JkIiwiY2xpZW50X2lkIjoicHJlIn0.WLbky8yxskrkOPB--tB7UbbiPFAhzy_P0v753Hdo6biiQ9U76ShwmjvfmVrF80s6LkbqYwoT-jtaT-PwBzhdFkECF8BYvBrUsHMCTnGjY0Pp7EByd9Da_VS4hjDfXwdzh3PYE6EgIvRTDk3khRgNz2eyjJZQHUBuBTKIWFXDwzg`;

// let timer;
// // 同步容器的参数到 store 中
// function dispatchState(value = null) {
//   const gApp = getDvaApp();
//   // 获取全局下挂载的 redux store，如果还未初始化，则异步轮询
//   // eslint-disable-next-line no-underscore-dangle
//   const _store = gApp && gApp._store;
//   if (!_store) {
//     // eslint-disable-next-line no-unused-expressions
//     timer && clearTimeout(timer);
//     timer = setTimeout(() => {
//       dispatchState(value);
//     }, 0);
//     return;
//   }
//   if (!value) {
//     queryCurrent().then(res => {
//       gApp._store.dispatch({
//         type: 'user/save',
//         payload: { currentUser: res || {} },
//       });
//     });
//     return;
//   }

//   const { menus, currentUser, collapsed, activeMenuIndex, hideSilderMenu = false } = value;
//   // queryCurrent().then(res => {
//   //   console.log(res, 'currentUser222');
//   //   gApp._store.dispatch({
//   //     type: 'user/save',
//   //     payload: { currentUser: res || {} },
//   //   });
//   // });
//   gApp._store.dispatch({
//     type: 'user/save',
//     payload: { currentUser },
//   });

//   store.session('token', value?.token);
//   window.token = value?.token;
//   gApp._store.dispatch({
//     type: 'menu/setMenuData',
//     payload: { menus, routes, collapsed, activeMenuIndex, hideSilderMenu },
//   });
// }
// /* eslint-disable import/prefer-default-export */
// // export const qiankun = {
//   // 应用加载之前
//   bootstrap() {},


//   // 应用 render 之前触发
//   async mount(props) {

//     if (!props) return;
//     const { onGlobalStateChange } = props;
//     // if (MicroApp) {
//     //   window._micro_app = MicroApp;
//     // }

//     onGlobalStateChange((value /* , prev */) => {
//       // 利用 redux 在全局挂载的 g_app.store，dispatch 全局事件。
//       if (!getDvaApp) {
//         return;
//       }
//       if (value && JSON.stringify(value) !== '{}') {
//         dispatchState(value);
//       } else {
//         // dispatchState({ hideSilderMenu });
//       }
//     }, true);
//     // history.push("/workFlow/workFlow/home");

//     // window.hideSilderMenu = hideSilderMenu;

//     // 应用挂载之后刷新一下，解决 popState 回调函数没有被调用到导致 history 没更新的问题
//     // const { pathname, search, hash } = window.location;
//     // history.replace(pathname + search + hash);
//   },
//   // 应用卸载之后触发
//   unmount() {
//     // window.hideSilderMenu = false;
//   },

//   // 应用卸载之后触发
//   update() {
//     // const { hideSilderMenu } = props;
//     // dispatchState({ hideSilderMenu });
//     // window.hideSilderMenu = hideSilderMenu;
//   },
// };

// // dispatchState();
// const signalR = require("@microsoft/signalr");

// window.token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRndld29yay5xcGljLmNuJTJGd3dwaWMlMkYyNTA2MTJfZmdmN3NpUTFUVGlCbGxzXzE2NjkxOTY3ODUlMkYwJTIyJTJDJTIyaW5kdXN0cnlUeXBlJTIyJTNBJTIybXl0eGwlMjIlMkMlMjJsb2dpblR5cGUlMjIlM0ElMjJub3JtYWwlMjIlMkMlMjJtZW1iZXJJZCUyMiUzQTE1MjIyMDM1NTExOTUyNzUzNTAlMkMlMjJtZW1iZXJOYW1lJTIyJTNBJTIyJUU2JTlEJThFJUU1JUJCJUJBJUU1JUJEJUFDJTIyJTJDJTIybW9iaWxlJTIyJTNBJTIyMTM2NTcwODY0NTElMjIlMkMlMjJvcmdJZCUyMiUzQTMzMDEwMDEwMDAwMDUlMkMlMjJvcmdOYW1lJTIyJTNBJTIyJUU2JTlEJUFEJUU1JUI3JTlFJUU2JTg5JTgwJUU2JTgwJTlEJUU0JUJBJTkyJUU4JUJGJTlFJUU3JUE3JTkxJUU2JThBJTgwJUU2JTlDJTg5JUU5JTk5JTkwJUU1JTg1JUFDJUU1JThGJUI4JTIyJTJDJTIyb3JnVHlwZSUyMiUzQSUyMmdlbmVyYWwlMjIlMkMlMjJyZWdpb25Db2RlJTIyJTNBJTIyMzMwMTAwMDAwMDAwMDAwMDAwJTIyJTJDJTIyc2hvcnROYW1lJTIyJTNBJTIyJUU5JUEyJTg0JUU1JThGJTkxJUU3JThFJUFGJUU1JUEyJTgzJTIyJTJDJTIyc291cmNlJTIyJTNBJTIyaW50ZXJuYWwlMjIlMkMlMjJ1c2VySWQlMjIlM0ExNTIyMjAzNTUxMTk1Mjc1MzUwJTJDJTIydXNlck5hbWUlMjIlM0ElMjIlRTYlOUQlOEUlRTUlQkIlQkElRTUlQkQlQUMlMjIlMkMlMjJ1c2VyVHlwZSUyMiUzQSUyMmVtcGxveWVlJTIyJTdEIiwidXNlcl9uYW1lIjoiMTM2NTcwODY0NTE7O25vcm1hbCIsIm9yZ19pZCI6MzMwMTAwMTAwMDAwNSwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTY2OTY0NDkxOSwianRpIjoiOTQyMTVmYzctOGU3MS00MWVlLWJiMjQtN2I3ZjVhNjM2Zjk5IiwiY2xpZW50X2lkIjoicHJlIn0.h_lhHZrFoT534MXRE1E1flnZt66-AG4bN7axV3Kt3Og_85TKYxtUzwgadjmj4oyfAr1otyagHxiSe1yKcmX8UZWhlz8Tj6eqz81lT_B0jhKej3pbtL26CX0oMKB19HRtX0LfWwD4zgYV3-HXaOyDpiB7J_M3rLLh6M8ydxoXIrA'

// const HEAD = `https://pt-prod.lbian.cn`
// const URL_SIGNALR_HUB_IMG = `${HEAD}/chathub`


// const receiveMsgHub = new signalR.HubConnectionBuilder()
//   .withUrl(URL_SIGNALR_HUB_IMG, {
//     accessTokenFactory: () => window.token
//   })
//   .configureLogging(signalR.LogLevel.Information)
//   .withAutomaticReconnect([0, 5000, 10000, 20000, 50000, 100000, 150000, 200000])
//   .build()

// console.log('hub succ...')

// receiveMsgHub.on('ReceiveChatMessage',res => {
//   res = JSON.parse(res)
//   res.data = JSON.parse(res.data)
//   console.log('chat msg', res)
// })

// receiveMsgHub.on('UpdateExternalUsers', res => {
//   console.log('update user msg', JSON.parse(res))
// })
// receiveMsgHub.on('UpdateRoomMsg', res => {
//   console.log('room msg', JSON.parse(res))
// })
// receiveMsgHub.on('NewExternalUsers',res => {
//   console.log('new user msg', JSON.parse(res))
// })


// receiveMsgHub.onclose((err) => {
//    console.log('连接断开了：', err)
// })
// receiveMsgHub.start().then(res => {
//      console.log('消息接收连接成功：', res)
// }).catch(err => {
//      console.log('消息接收连接失败：', err)
// })