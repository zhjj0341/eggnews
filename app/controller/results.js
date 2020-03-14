'use strict';
const Controller = require('egg').Controller;

class ResultController extends Controller {
  async index() {
    const ctx = this.ctx;
    const opts = { skip: ctx.query.offset, limit: ctx.query.limit };
    ctx.body = await this.ctx.model.Result
      .find(null, null, opts)
      .populate({
        path: 'user_id',
        select: 'name -_id',
      }).exec();
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const result = await ctx.model.result.deleteOne({ _id: id }).exec();
    if (!result) {
      ctx.status = 404;
      return;
    }

    ctx.status = 200;
  }
}

module.exports = ResultController;
