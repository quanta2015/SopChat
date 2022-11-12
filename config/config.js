import pageRoutes from './router.config';
import { defineConfig } from 'umi';
import defaultSettings from '../src/defaultSettings';
import { base } from '../src/base';
const { BUILD_ENV } = process.env;
const { primaryColor } = defaultSettings;
const PUBLIC_PATH = `${base}/`;

export default defineConfig({
  publicPath: BUILD_ENV === 'production' ? PUBLIC_PATH : '/',
  base,
  dva: {
    hmr: true,
  },
  hash: true,
  history: {
    type: 'browser',
  },
  layout: false,
  copy:
    BUILD_ENV === 'dev'
      ? [
          {
            from: '/conf.json',
            to: '/rhyysshl/pc/',
          },
          {
            from: '/data',
            to: '/data',
          },
        ]
      : [],

  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/antd-pro-components/PageLoading/index',
  },
  chainWebpack: function(config, { webpack }) {
    if (BUILD_ENV === 'production') {
      config.merge({
        optimization: {
          splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 3,
            automaticNameDelimiter: '.',
            cacheGroups: {
              vendor: {
                name: 'vendors',
                chunks: 'all',
                test: /(react|react-dom|react-dom-router|babel-polyfill)/,
                priority: 100,
              },
              ali_oss: {
                name: 'ali_oss',
                test: /ali-oss/,
                chunks: 'async',
                reuseExistingChunk: true,
                priority: 100,
              },
              wangeditor: {
                name: 'wangeditor',
                test: /wangeditor/,
                chunks: 'async',
                reuseExistingChunk: true,
                priority: 100,
              },
              suo_web_all: {
                name: 'suo_web_all',
                test: /suo-web-all/,
                chunks: 'async',
                priority: 120,
              },
              lodash: {
                name: 'lodash',
                test: /lodash/,
                chunks: 'async',
                reuseExistingChunk: true,
                priority: 100,
              },
              moment: {
                name: 'moment',
                test: /moment/,
                chunks: 'async',
                reuseExistingChunk: true,
                priority: 100,
              },
              ant_design: {
                name: 'ant_design',
                test: /@ant-design/,
                chunks: 'async',
                reuseExistingChunk: true,
                priority: 120,
              },
              antd: {
                name: 'antd',
                test: /antd/,
                chunks: 'async',
                reuseExistingChunk: true,
                priority: 120,
              },
              commons: {
                chunks: 'all',
                minChunks: 2,
                name: 'commons',
                priority: 10,
                enforce: true,
                reuseExistingChunk: true,
              },
            },
          },
        },
      });
    }
  },
  devtool: BUILD_ENV === 'production' ? false : 'source-map',
  qiankun: {
    slave: {},
  },
  metas: [
    {
      name: 'x-server-env',
      content: BUILD_ENV,
    },
  ],

  targets: {
    ie: 9,
    edge: 9,
  },
  routes: pageRoutes,
  title: false,
  theme: {
    'primary-color': primaryColor,
  },
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  mfsu: {},
  webpack5: {},
});
