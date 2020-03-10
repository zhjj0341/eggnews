'use strict';
// app/router.js
module.exports = app => {
  const { router, controller, jwt } = app;
  app.router.redirect('/index', '/', 302);
  router.get('/', controller.home.index);

  router.resources('users', '/users', controller.users);
  router.get('/preview/users', controller.users.list);

  // 正常路由
  router.post('/api/user/login', controller.users.login);
  /*
  * 这里的第二个对象不再是控制器，而是 jwt 验证对象，第三个地方才是控制器
  * 只有在需要验证 token 的路由才需要第二个 是 jwt 否则第二个对象为控制器
  **/
  router.post('/api/user', jwt, controller.users.index);

  // router.post('/post', controller.home.post);
  // router.get('/news', controller.news.list);
  // router.get('/news/item/:id', controller.news.detail);
  // router.get('/news/user/:id', controller.news.user);
  // router.get('/api', controller.api.show);

  // require('./router/upload')(app);


  // questions handler starts here
  router.get('/api/questions/first', controller.questions.first);
  router.post('/api/questions/next', controller.questions.next);
  router.resources('questions', '/api/questions', controller.questions);
  // router.post('/api/questions/next', controller.questions.next);
};
