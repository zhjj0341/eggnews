'use strict';
/**
 * 框架会把 app/extend/application.js 中定义的对象与 Koa Application 的 prototype 对象进行合并，
 * 在应用启动时会基于扩展后的 prototype 生成 app 对象。
 * 例如，我们要增加一个 app.foo() 方法：
 */
const BAR = Symbol('Application#bar');
module.exports = {
  /**
 * 方法扩展
 */
  foo(param) {
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
  },

  /**
     * 属性扩展
     * 一般来说属性的计算只需要进行一次，那么一定要实现缓存，否则在多次访问属性时会计算多次，这样会降低应用性能。
     * 推荐的方式是使用 Symbol + Getter 的模式。
     * 例如，增加一个 app.bar 属性 Getter：
     */
  get bar() {
    if (!this[BAR]) {
      // 实际情况肯定更复杂
      this[BAR] = this.config.xx + this.config.yy;
    }
    return this[BAR];
  },
};
