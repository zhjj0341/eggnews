// 在中间件最前面统计请求时间
module.exports = () => {
    return async function (ctx, next) {
      const startTime = Date.now();
      await next();
      // 上报请求时间
      reportTime(Date.now() - startTime);
    }
  };