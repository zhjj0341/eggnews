'use strict';
module.exports = options => {
  return async function(ctx, next) {
    // 拿到传会数据的header 中的token值
    const token = ctx.request.header.authorization;
    let decode_token;
    // 当前请求时get请求，执行接下来的中间件
    if (!token) {
      if (ctx.path === '/api/user/login') {
        await next();
      } else {
        ctx.throw(401, '未登录， 请先登录');
      }
    } else { // 当前token值存在
      try {
        // 验证token
        decode_token = ctx.service.jwt.jwtVerify(token);
        if (!decode_token || !decode_token.name) {
          ctx.throw(401, '没有权限，请登录');
        }
        if (Date.now() - decode_token.exp * 1000 > 0) {
          ctx.throw(401, '登录已过期,请重新登录');
        }
        const user = await ctx.model.User.find({
          userName: decode_token.name,
        });
        if (user) {
          await next();
        } else {
          ctx.throw('401', '用户信息验证失败');
        }
      } catch (e) {
        console.log(e);
      } finally {
        if (
          decode_token &&
          Date.now() > decode_token.exp * 1000 + -5 * 60 * 1000
        ) { // 如果response的时候token还有5分钟过期，则需要更新token
          const user = await ctx.model.User.find({
            userName: decode_token.name,
          });
          const token = ctx.service.jwt.jwtSign(user);
          ctx.set('authorization', token);
          ctx.set('token-refresh-at', Date.now());
          ctx.set('Access-Control-Expose-Headers', 'Authorization,Token-Refresh-At');
        }
      }
    }
  };
};
