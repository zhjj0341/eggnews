'use strict';
module.exports = app => {
  return {
    disable: true,
    schedule: {
      interval: '1m', // 1 分钟间隔 app.config.cacheTick,
      type: 'all',
    },
    async task(ctx) {
      // const res = await ctx.curl('http://www.api.com/cache', {
      //   contentType: 'json',
      // });
      // ctx.app.cache = res.data;

    },
  };
};
