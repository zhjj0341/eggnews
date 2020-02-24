'use strict';
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class QuestionController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.body = await this.ctx.model.Question.find().exec();
  }

  async create() {
    // create new question
    const ctx = this.ctx;
    const question = new this.ctx.model.Question();

    const form = ctx.request.body;

    question.level = form.level;
    question.desc = form.desc;
    question.type = form.type;
    question.content_type = form.content_type;
    question.candidate_type = form.candidate_type;
    question.question = form.question;
    question.candidate = form.candidate;
    question.candidate_group = form.candidate_group;
    question.answer = form.answer;

    question.save();

    ctx.status = 200;
    ctx.body = question;
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const item = await ctx.model.Question.findOne({ _id: id }).exec();
    if (!item) {
      ctx.status = 404;
      return;
    }

    const { level, desc, type, content_type, candidate_type, question, candidate, candidate_group, answer } = ctx.request.body;
    await item.update({ level, desc, type, content_type, candidate_type, question, candidate, candidate_group, answer });
    ctx.body = item;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const item = await ctx.model.Question.deleteOne({ _id: id }).exec();
    if (item.ok !== 1) {
      ctx.status = 404;
      return;
    }
    ctx.body = item;
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Question.findOne({ _id: ctx.params.id })
      .select({ level: 1, type: 1, candidate_type: 1, desc: 1, question: 1, candidate: 1, candidate_group: 1 })
      .exec();

  }

}

module.exports = QuestionController;
