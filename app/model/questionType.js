'use strict';

const utility = require('utility');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const QuestionTypeSchema = new Schema({
    name: { type: String },
    id: { type: Number },
  });

  return mongoose.QuestionTypeSchema.model('QuestionType', QuestionTypeSchema)
};
