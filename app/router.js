'use strict';
// app/router.js
module.exports = app => {
  const { router, controller } = app;
  app.router.redirect('/index', '/', 302);
  router.get('/', controller.home.index);

  router.resources('users', '/users', controller.users);

  router.post('/post', controller.home.post);

  router.get('/news', controller.news.list);
  router.get('/news/item/:id', controller.news.detail);
  router.get('/news/user/:id', controller.news.user);

  router.get('/api', controller.api.show);

  require('./router/upload')(app);


  // questions handler starts here
  router.resources('questions', '/api/questions', controller.questions);
};
