'use strict';
// app/controller/home.js
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const ctx = this.ctx;
    // this.ctx.body = 'hello world';
    // const examResult = await ctx.curl('http://127.0.0.1:5000/firstQuestion', {
    //   method: 'POST',
    //   dataType: 'json',
    //   contentType: 'json',
    //   data: { questions: [{ question: 'aaaaa', difficulty: 0.4 }, { question: 'bbb', difficulty: 0.8 }, { question: 'cc', difficulty: 0.2 }, { question: 'dd', difficulty: 0.6 }, { question: 'ee', difficulty: 0.9 }, { question: 'ff', difficulty: 0.3 }] },
    // });
    const result = await ctx.curl('http://127.0.0.1:5000/analyseResult', {
      method: 'POST',
      dataType: 'json',
      contentType: 'json',
    });
      // ctx.status = examResult.status;
      // ctx.set(examResult.headers);
    console.log(result);
    ctx.body = { stop: true, result: result.data };
    // this.ctx.body = 'hello world';
  }

  async post() {
    this.ctx.body = this.ctx.request.body;
  }
}

module.exports = HomeController;
