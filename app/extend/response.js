'use strict';
/**
 * 框架会把 app/extend/response.js 中定义的对象与内置 response 的 prototype 对象进行合并，
 * 在处理请求时会基于扩展后的 prototype 生成 response 对象。
 */

module.exports = {
  // 例如，增加一个 response.foo 属性 setter：
  // 就可以这样使用啦：this.response.foo = 'bar';
  set foo(value) {
    this.set('x-response-foo', value);
  },
};
