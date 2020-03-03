'use strict';
// app/controller/home.js
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hello world';
  }

  async post() {
    this.ctx.body = this.ctx.request.body;
  }
}

module.exports = HomeController;
