'use strict';
const utility = require('utility');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    name: { type: String },
    type: { type: Number, default: 1 }, // 1-用户，2-管理员
    pass: { type: String },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    accessToken: { type: String },
  });

  UserSchema.index({ name: 1 }, { unique: true });

  UserSchema.pre('save', function(next) {
    const now = new Date();
    this.update_at = now;
    next();
  });

  return mongoose.model('User', UserSchema);
};
