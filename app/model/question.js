'use strict';
const utility = require('utility');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const QuestionSchema = new Schema({
    id: { type: String },
    type: { type: Number },
    content_type: { type: Number },
    desc: { type: String },
    question: { type: Schema.Types.Mixed },
    candidate: { type: Schema.Types.Mixed },
    answer: { type: Schema.Types.Mixed },
  });

  return mongoose.model('Question', QuestionSchema);
};
