'use strict';
const utility = require('utility');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const QuestionSchema = new Schema({
    difficulty: { type: Number, default: 1 },
    desc: { type: String },
    type: { type: Number, default: 1 },
    content_type: { type: Number, default: 1 },
    candidate_type: { type: Number, default: 1 },
    question: { type: Schema.Types.Mixed },
    candidate: { type: Schema.Types.Mixed }, // 每个问题自己单独的选项
    candidate_group: { type: Schema.Types.Mixed }, // 共用的选项
    answer: { type: Schema.Types.Mixed },
    discrimination: { type: String },
    knowledge_point: { type: String },
  });

  return mongoose.model('Question', QuestionSchema);
};
