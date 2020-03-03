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

    question.difficulty = form.difficulty;
    question.desc = form.desc;
    question.type = form.type;
    question.content_type = form.content_type;
    question.candidate_type = form.candidate_type;
    question.question = form.question;
    question.candidate = form.candidate;
    question.candidate_group = form.candidate_group;
    question.answer = form.answer;
    question.discrimination = form.discrimination;
    question.knowledge_point = form.knowledge_point;

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

    const { difficulty, desc, type, content_type, candidate_type, question, candidate, candidate_group, answer, discrimination, knowledge_point } = ctx.request.body;
    await item.update({ difficulty, desc, type, content_type, candidate_type, question, candidate, candidate_group, answer, discrimination, knowledge_point });
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
      .select({ difficulty: 1, type: 1, candidate_type: 1, desc: 1, question: 1, candidate: 1, candidate_group: 1, discrimination: 1, knowledge_point: 1 })
      .exec();

  }

  async first() {
    const ctx = this.ctx;
    const allQuestions = await ctx.model.Question
      .aggregate()
      .project({ question: '$_id', difficulty: '$difficulty' })
      .exec();
    // console.log(ctx.body);
    const result = await ctx.curl('http://127.0.0.1:5000/firstQuestion', {
      method: 'POST',
      dataType: 'json',
      contentType: 'json',
      data: { questions: allQuestions } });

    if (result.status !== 200) {
      ctx.status = 422;
      ctx.body = {
        error: '抽取题目错误!',
      };
      return;
    }
    // ctx.set(result.headers);
    // console.log(result);
    const showQuestion = await ctx.model.Question.findOne({ _id: result.data.question })
      .select({ difficulty: 1, type: 1, candidate_type: 1, desc: 1, question: 1, candidate: 1, candidate_group: 1, discrimination: 1, knowledge_point: 1 })
      .exec();
    ctx.body = showQuestion;
    // console.log(ctx.body);
  }

  async next() {
    const ctx = this.ctx;
    const result = await ctx.curl('http://127.0.0.1:5000/test', { dataType: 'json' });
    ctx.set(result.headers);
    // console.log(result);
    ctx.body = result.data;
    ctx.body.fromPython = true;
    // console.log(ctx.body.fromPython);
  }
}

module.exports = QuestionController;
