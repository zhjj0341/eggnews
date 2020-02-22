'use strict';
/**
 * 框架会把 app/extend/context.js 中定义的对象与 Koa Context 的 prototype 对象进行合并，
 * 在处理请求时会基于扩展后的 prototype 生成 ctx 对象。
 * 例如，我们要增加一个 ctx.foo() 方法：
 */
const BAR = Symbol('Context#bar');

module.exports = {
  /**
     * 方法扩展
     */
  foo(param) {
    // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
  },

  get bar() {
    // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
    if (!this[BAR]) {
      // 例如，从 header 中获取，实际情况肯定更复杂
      this[BAR] = this.get('x-bar');
    }
    return this[BAR];
  },
};
