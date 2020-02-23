'use strict';
const Controller = require('egg').Controller;

class QuestionController extends Controller {
  async create() {
    // create new question
    const ctx = this.ctx;
    const question = new this.ctx.model.Question();

    const  content_type = ctx.request.body.CONTENT_TYPE;
    const question_type = ctx.request.body.QUESTION_TYPE;
    const form = ctx.request.body.form;

    question.id = form.id;
    question.type = question_type;
    question.content_type = content_type;
    question.desc = form.desc;
    question.question = form.question;
    question.candidate = form.candidate;
    question.answer = form.answer;

    question.save()
    
    ctx.status = 201;
    ctx.body = question;

  };
  async show() {
    // render question 
  };
}

module.exports = QuestionController;
