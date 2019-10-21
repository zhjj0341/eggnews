const Controller = require('egg').Controller;

class ProxyController extends Controller {
    async show () {
        const ctx = this.ctx;
        const start = Date.now();
        ctx.body = { a: 1 };
        const used = Date.now() - start;
        await 1000
        // 设置一个响应头
        ctx.set('show-response-time', used.toString());
    }
};

module.exports = ProxyController;