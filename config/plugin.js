'use strict';
const path = require('path');
module.exports = {
  // 在上层框架内部内置的插件，应用在使用时就不用配置 package 或者 path，只需要指定 enable 与否：
  // 对于内置插件，可以用下面的简洁方式开启或关闭
  onerror: true,

  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },

  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },

  cors: {
    enable: true,
    package: 'egg-cors',
  },

  ua: {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-ua'),
  },
};
