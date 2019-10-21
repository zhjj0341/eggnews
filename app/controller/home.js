// app/controller/home.js
const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index () {
        this.ctx.body = 'hello world';
    }

    async post () {
        console.log(this.ctx.request)
        this.ctx.body = this.ctx.request.body;
    }
}

module.exports = HomeController;