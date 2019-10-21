/**
 * 框架会把 app/extend/request.js 中定义的对象与内置 request 的 prototype 对象进行合并，
 * 在处理请求时会基于扩展后的 prototype 生成 request 对象
 */
const IS_CHROME = Symbol('Request#isChrome');
module.exports = {
    // 增加一个 request.foo 属性 Getter：
    get foo () {
        return this.get('x-request-foo');
    },
    get isChrome () {
        if (!this[IS_CHROME]) {
            const ua = this.get('User-Agent').toLowerCase();
            this[IS_CHROME] = ua.includes('chrome/');
        }
        return this[IS_CHROME];
    },
};