'use strict';
/**
 * Helper 函数用来提供一些实用的 utility 函数。
 * 它的作用在于我们可以将一些常用的动作抽离在 helper.js 里面成为一个独立的函数，这样可以用 JavaScript 来写复杂的逻辑，避免逻辑分散各处。
 * 另外还有一个好处是 Helper 这样一个简单的函数，可以让我们更容易编写测试用例。
 * 框架内置了一些常用的 Helper 函数。我们也可以编写自定义的 Helper 函数。
 */
const moment = require('moment');
const crypto = require('crypto');
module.exports = {
  // 通过 ctx.helper 访问到 helper 对象，例如：
  relativeTime: time => moment(new Date(time * 1000)).fromNow(),

  encrypt: content => crypto.createHash('md5').update(content).digest('hex'),
};

