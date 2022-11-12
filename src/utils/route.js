export const jumpToLogin = () => {
  /**
   * url的重定向映射
   * 不同的域名可能有不同的登陆url
   * 如果没有匹配到，默认跳转到location.origin+'/login'页面
   */
  const urlMapping = {
    'teacher.xxx.com': '//xx.com',
  };

  const loginGuide = global.location.hostname;

  if (urlMapping[loginGuide]) {
    location.href = urlMapping[loginGuide];
    return;
  }

  location.href = `${location.origin}/login`;
};
