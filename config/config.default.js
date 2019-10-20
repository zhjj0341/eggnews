module.exports = {
    keys: 'asdasdasd',

    view: {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.tpl': 'nunjucks',
        },
    },

    news: {
        pageSize: 5,
        serverUrl: 'https://hacker-news.firebaseio.com/v0',
    },
    
    /**
     * middleware start
     * 1.所有的这些自带中间件的配置项都通过在配置中修改中间件同名配置项进行修改
     * 2.无论是应用层加载的中间件还是框架自带中间件，都支持几个通用的配置项：
        enable：控制中间件是否开启。
        match：设置只有符合某些规则的请求才会经过这个中间件。
        ignore：设置符合某些规则的请求不经过这个中间件。
     */
    // 配置需要的中间件，数组顺序即为中间件的加载顺序
    middleware: [ 'robot','compress', 'gzip' ],

    robot: {
        ua: [
            /curl/i,
            /Baiduspider/i,
        ],
    },

    compress: {
        enable: false,
        threshold: 2048,
    },

    bodyParser: {
        jsonLimit: '10mb',
    },

    // 配置 gzip 中间件的配置
    gzip: {
        match: '/static',
        threshold: 1024, // 小于 1k 的响应体不压缩
    },

    // middleware end
  };