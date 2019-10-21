module.exports = app => {
    const { router, controller } = app;
    router.get('/upload', controller.upload.index)
    router.post('/upload', controller.upload.upload)
};