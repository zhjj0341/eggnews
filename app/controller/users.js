'use strict';
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UserController extends Controller {
  async list() {
    const ctx = this.ctx;
    const opts = { skip: toInt(ctx.query.offset), limit: toInt(ctx.query.limit) };
    console.log(await this.ctx.model.User.find(null, null, opts).exec());
    ctx.body = await this.ctx.model.User.find(null, null, opts).exec();
  }

  async new() {
    console.log('new');
    await this.ctx.render('user.tpl');
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.User.findOne({ _id: toInt(ctx.params.id) }).exec();
  }

  async create() {
    const ctx = this.ctx;
    const { name, pass, type } = ctx.request.body;

    const user = new this.ctx.model.User();
    user.name = name;
    user.pass = ctx.helper.encrypt(pass);
    // user.pass = pass;
    user.type = type;
    user.save();

    ctx.status = 201;
    ctx.body = user;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findOne({ _id: id }).exec();
    if (!user) {
      ctx.status = 404;
      return;
    }

    const { name, age } = ctx.request.body;
    await user.update({ name, age });
    ctx.body = user;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.deleteOne({ _id: id }).exec();
    if (!user) {
      ctx.status = 404;
      return;
    }

    await user.destroy();
    ctx.status = 200;
  }

  // 验证登录并且生成 token
  async login() {
    const { ctx, app } = this;

    // 获取用户端传递过来的参数
    const data = ctx.request.body;
    const { name, pass } = ctx.request.body;
    if (!name || !pass) {
      ctx.status = 400;
      ctx.body = {
        error: '请输入用户名和密码!',
      };
      return;
    }
    // console.log({ name, pass: _pass });
    // 进行验证 data 数据 登录是否成功
    const user = await ctx.model.User.findOne({
      name,
      pass: ctx.helper.encrypt(pass),
    });
    if (!user) {
      ctx.status = 400;
      ctx.body = {
        error: '用户信息不正确!',
      };
      return;
    }
    // 成功过后进行一下操作
    // 生成 token 的方式
    const token = this.service.jwt.jwtSign(user);
    // 生成的token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1NjAzNDY5MDN9.B95GqH-fdRpyZIE5g_T0l8RgzNyWOyXepkLiynWqrJg

    // 返回 token 到前端
    ctx.body = {
      name: user.name, // 需要存储的 token 数据
      type: user.type,
      token,
    };
  }

  // 访问user数据时进行验证token，并且解析 token 的数据
  async index() {

    const { ctx, app } = this;

    console.log(ctx.state.user);
    /*
    * 打印内容为：{ username : 'admin', iat: 1560346903 }
    * iat 为过期时间，可以单独写中间件验证，这里不做细究
    * 除了 iat 之后，其余的为当时存储的数据
    **/
    const user = ctx.state.user;
    ctx.body = { name: user.name, type: user.type };
  }
}

module.exports = UserController;
