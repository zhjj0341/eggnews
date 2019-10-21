// app/router.js
module.exports = app => {
    const { router, controller } = app;
    app.router.redirect('/index', '/', 302);
    router.get('/', controller.home.index);

    router.resources('users', '/users', controller.users);

    router.post('/post', controller.home.post);

    router.get('/news', controller.news.list)
    router.get('/api', controller.api.show)

    require('./router/upload')(app);
};