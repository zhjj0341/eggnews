'use strict';

const Service = require('egg').Service;

class JwtService extends Service {
  jwtSign(user) { // 生成的token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1NjAzNDY5MDN9.B95GqH-fdRpyZIE5g_T0l8RgzNyWOyXepkLiynWqrJg
    return this.app.jwt.sign(
      {
        id: user._id,
        name: user.name, // 需要存储的 token 数据
        type: user.type,
      },
      this.config.jwt.secret,
      {
        expiresIn: this.config.jwt.expiresIn, // 有效期
      }
    );
  }

  jwtVerify(token) {
    return this.app.jwt.verify(token.split(' ')[1], this.config.jwt.secret);
  }
}

module.exports = JwtService;
