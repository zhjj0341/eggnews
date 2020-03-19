'use strict';
module.exports = options => {
  return async function(ctx, next) {
    // 拿到传会数据的header 中的token值
    const token = String(ctx.request.header.authorization).split(' ')[1];
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
        if (
          (!decode_token || !decode_token.name) || // token信息不正确
          Date.now() - decode_token.exp * 1000 > 0// 有效期过了
        ) {
          ctx.throw(401, '登录失效,请重新登录');
        }

        // 查询用户存在
        const user = await ctx.model.User.findOne({
          name: decode_token.name,
        }).exec();
        // accessToken: token,

        if (!user || !user.accessToken) {
          ctx.throw('401', '用户信息验证失败');
        }
        const dbToken = ctx.service.jwt.jwtVerify(user.accessToken);
        let refreshToken = user.accessToken;
        /**
           * 先对比token是否跟db里面user的accessToken是否一样
           * 1.一样证明验证通过
           * 2.不一样有可能是短期内，刷新过token，但是有部分客户端/同时发了很多个请求（用相同token同时时请求，但只有一个求情刷新了），需要告诉他们需要用新的token
           * 3. 如果token还有5分钟过期，则需要更新token
           */
        if (
          user.accessToken !== token &&
          Date.now() - dbToken.iat * 1000 > 5 * 60 * 1000
        ) {
          ctx.throw('401', '登录失效,请重新登录');
        }

        if (// 如果response的时候token还有5分钟过期，则需要更新token
          decode_token &&
          Date.now() > decode_token.exp * 1000 - 5 * 60 * 1000
        ) {
          refreshToken = ctx.service.jwt.jwtSign(user);
          user.accessToken = refreshToken;
          user.save();
        }

        ctx.set('authorization', refreshToken);
        ctx.set('token-refresh-at', Date.now());
        ctx.set('Access-Control-Expose-Headers', 'Authorization,Token-Refresh-At');
      } catch (e) {
        ctx.status = 401;
        ctx.body = { error: e.message === 'jwt expired' ? '登录失效,请重新登录' : e.message };
        return;
      }
      await next();
    }
  };
};
