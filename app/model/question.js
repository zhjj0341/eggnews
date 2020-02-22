'use strict';
const utility = require('utility');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema();

  const QuestionSchema = new Schema({
    id: { type: String },
    type: { type: String }, 
    desc: { type: String },
    question: { type: ofMixed },
    candidate: { type: ofMixed },
    answer: { type: mongoose.Mixed },
  });

  QuestionSchema.pre('save', function(next) {
    if (!this.created)
    next();
  });

  return mongoose.model('Question', QuestionSchema);
};
