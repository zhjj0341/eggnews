'use strict';
const _ = require('lodash');
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

function randomizeDifficulty(questionListObject) {
  questionListObject.forEach(function(questionObject) {
    questionObject.difficulty = (questionObject.difficulty - Math.random()) / 3;
  });
  //   if (questionObject.difficulty === 1) {
  //     questionObject.difficulty = Math.random() * (1 / 3 - 1 / 1000) + 1 / 1000;
  //   } else if (questionObject.difficulty === 2) {
  //     questionObject.difficulty = Math.random() * (2 / 3 - 1 / 3) + 1 / 3;
  //   } else {
  //     questionObject.difficulty = Math.random() * (1 - 2 / 3) + 2 / 3;
  //   }
  // });
  return questionListObject;
}

function setQuestionCacheKey(userName) {
  return userName + '_question';
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
    await this.service.cache.del(setQuestionCacheKey(ctx.state.user.name));
    // ctx.body = 'hello';
    let result = await this.service.cache.get(setQuestionCacheKey(ctx.state.user.name));
    // console.log(result);
    if (!result) {
      let allQuestions = await ctx.model.Question
        .aggregate()
        .project({ question: '$_id', difficulty: '$difficulty', knowledge_point: '$knowledge_point' })
        .exec();
      allQuestions = randomizeDifficulty(allQuestions);

      result = await ctx.curl('http://127.0.0.1:5000/firstQuestion', {
        method: 'POST',
        dataType: 'json',
        contentType: 'json',
        data: { questions: allQuestions },
      });

      if (result.status !== 200) {
        ctx.status = 422;
        ctx.body = {
          error: '抽取题目错误!',
        };
        return;
      }
      result = result.data;
      await this.service.cache.setex(setQuestionCacheKey(ctx.state.user.name), {
        index: result.index,
        object: result.object,
        question: result.question,
      }, 60 * 5); // 五分钟
    }

    const showQuestion = await ctx.model.Question.findOne({ _id: result.question })
      .select({ difficulty: 1, type: 1, candidate_type: 1, desc: 1, question: 1, candidate: 1, candidate_group: 1, discrimination: 1, knowledge_point: 1 })
      .exec();
    ctx.body = showQuestion;
  }

  async next() {
    const ctx = this.ctx;
    const questionUserCache = await this.service.cache.get(setQuestionCacheKey(ctx.state.user.name));

    if (!questionUserCache) {
      ctx.status = 400;
      ctx.body = { error: '未检测到题目，请重新答题!' };
      return;
    }

    // 获取用户提交的答案
    const form = ctx.request.body;
    const userAnswer = form.answer;
    if (!userAnswer) {
      ctx.status = 422;
      ctx.body = { error: '请提交答案!' };
      return;
    }

    const questionItem = await ctx.model.Question.findOne({ _id: questionUserCache.question })
      .select({ answer: 1, type: 1 })
      .exec();

    // 获取配置
    const config = this.config;
    const answer = questionItem.answer;

    let correct = true;
    for (const key in answer) { // 遍历标准答案
      if (config.QUESTION_TYPE.RADIO === questionItem.type) { // 单选
        // 如果全部题目其中有一个题目的答案不符合,即是错误
        if (String(userAnswer[key]) !== String(answer[key])) {
          correct = false;
          break;
        }
      } else if (config.QUESTION_TYPE.RADIO === questionItem.type) { // 多选
        const _xor = _.xor(userAnswer[key], answer[key]);// _.xor([2, 1], [2, 3])=> [1, 3]
        // 如果用户提交的答案跟标准答案的有不一样的选项即视为错误
        if (_xor.length > 0) {
          correct = false;
          break;
        }
      } else { // 填空
        // 填空的标准答案是数组，如果用户的答案是标准答案之中的其中一个，即视为正确
        correct = !!_.find(answer[key], o => { return String(userAnswer[key]) === o; });
      }
    }

    // todo：nextquestion
    const nextQuestion = await ctx.curl('http://127.0.0.1:5000/nextQuestion', {
      method: 'POST',
      dataType: 'json',
      contentType: 'json',
      data: {
        correct,
        index: questionUserCache.index,
        object: questionUserCache.object,
        raw_answer: userAnswer,
      },
    });

    // 题目不够/太少的时候，这里返回的信息有问题，需要判断一下
    // 更新题目验证信息
    await this.service.cache.setex(setQuestionCacheKey(ctx.state.user.name), {
      index: nextQuestion.data.index,
      object: nextQuestion.data.object,
      question: nextQuestion.data.question,
    }, 60 * 5); // 五分钟

    const stopMsg = await ctx.curl('http://127.0.0.1:5000/stopQuestion', {
      method: 'POST',
      dataType: 'json',
      contentType: 'json',
      data: {
        object: nextQuestion.data.object,
      },
    });
    console.log(stopMsg);
    // console.log(nextQuestion.data.object);

    // 停止就需要返回需要停止的信息
    if (stopMsg.data.stop === true) {
      const ctx = this.ctx;
      const result = new this.ctx.model.Result();
      const user = ctx.state.user;
      result.user_id = user.id;
      // console.log(user.id);
      result.exam_result = stopMsg.data.exam_result;
      await result.save();
      await this.service.cache.del(setQuestionCacheKey(user.name));
      const user_name = await this.ctx.model.Result.findOne({ _id: result._id }).populate({ path: 'user_id', select: 'name -_id' }).exec();
      ctx.body = { stop: true, message: stopMsg.data.message, result: user_name };
      return;
    }

    // 查找下一个题目并且返回
    const showQuestion = await ctx.model.Question.findOne({ _id: nextQuestion.data.question })
      .select({ difficulty: 1, type: 1, candidate_type: 1, desc: 1, question: 1, candidate: 1, candidate_group: 1, discrimination: 1, knowledge_point: 1 })
      .exec();
    ctx.body = showQuestion;
  }
}

module.exports = QuestionController;
