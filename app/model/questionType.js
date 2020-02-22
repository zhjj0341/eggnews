'use strict';

const utility = require('utility');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const QuestionSchema = new Schema({
    name: { type: String },
    id: { type: Number },
  });

};
