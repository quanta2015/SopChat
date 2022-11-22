import { defineConfig } from 'umi';


export default defineConfig({
  base: '/',
  publicPath: '/',
  devtool: 'source-map',
  // exportStatic: {},
  dva: {
    hmr: true,
  },
  hash: true,
  history: {
    type: 'hash',
  },
  exportStatic: {},
  layout: false,
  // exportStatic: {},
  routes: [
    {
      path: '/',
      routes: [
        {path:`/sop`,  component:'@/pages/Index/index'},
        {path:`/auth`, component:'@/pages/Auth/index'}
      ],
    },
  ],
  qiankun: {
    slave: {},
  },
  manifest: {
    basePath: '/',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  webpack5: {},
  // fastRefresh: {},
  // dynamicImport: {},
  mfsu: {},
  antd: false,
  metas: [
    {
      name: 'x-server-env',
      content: process.env.BUILD_ENV,
    },
  ],
});
