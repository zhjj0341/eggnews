'use strict';
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/controller/home.test.js', () => {
  before(() => console.log('order 1'));
  before(() => console.log('order 2'));
  after(() => console.log('order 6'));
  beforeEach(() => console.log('order 3'));
  afterEach(() => console.log('order 5'));
  it('should worker', () => console.log('order 4'));

  // test cases
  it('should get a ctx', () => {
    const ctx = app.mockContext();
    assert(ctx.method === 'GET');
    assert(ctx.url === '/');
  });

  it('should mock ctx.user', () => {
    const ctx = app.mockContext({
      user: {
        name: 'fengmk2',
      },
    });
    assert(ctx.user);
    assert(ctx.user.name === 'fengmk2');
  });

  // 使用返回 Promise 的方式
  it('should redirect', () => {
    return app.httpRequest()
      .get('/index')
      .expect(302);
  });

  // 使用 callback 的方式
  it('should redirect', done => {
    app.httpRequest()
      .get('/index')
      .expect(302, done);
  });

  // 使用 async
  it('should redirect', async () => {
    await app.httpRequest()
      .get('/index')
      .expect(302);
  });

  describe('GET /', () => {
    it('should status 200 and get the body', () => {
      // 对 app 发起 `GET /` 请求
      return app.httpRequest()
        .get('/')
        .expect(200) // 期望返回 status 200
        .expect('hello world'); // 期望 body 是 hello world
    });

    it('should send multi requests', async () => {
      // 使用 generator function 方式写测试用例，可以在一个用例中串行发起多次请求
      await app.httpRequest()
        .get('/')
        .expect(200) // 期望返回 status 200
        .expect('hello world'); // 期望 body 是 hello world

      // 再请求一次
      const result = await app.httpRequest()
        .get('/')
        .expect(200)
        .expect('hello world');

      // 也可以这样验证
      assert(result.status === 200);
    });

    it('should status 200 and get the request body', () => {
      // 模拟 CSRF token，下文会详细说明
      app.mockCsrf();
      return app.httpRequest()
        .post('/post')
        .type('form')
        .send({
          foo: 'bar',
        })
        .expect(200)
        .expect({
          foo: 'bar',
        });
    });
  });
});
