'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ResultSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId },
    exam_result: { type: Schema.Types.Mixed },
    time: { type: Schema.Types.Date, default: Date.now },
  });

  return mongoose.model('Result', ResultSchema);
};
