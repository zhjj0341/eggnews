'use strict';
module.exports = {
  keys: 'asdasdasd',

  cluster: {
    listen: {
      port: 7001,
      hostname: '127.0.0.1', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
      // path: '/var/run/egg.sock',
    },
  },
  session: {
    // key: 'EGG_SESS',
    // maxAge: 24 * 3600 * 1000, // 1 天
    // httpOnly: true,
    // encrypt: true,
  },

  news: {
    pageSize: 5,
    serverUrl: 'https://hacker-news.firebaseio.com/v0',
  },

  /**
     * plugins start
     */
  multipart: {
    mode: 'file',
  },

  security: {
    csrf: {
    //   ignore: '/api/*/*',
      enable: false,
    },
    // ['.domain.com'],  安全白名单，以 . 开头
    domainWhiteList: [ '*' ],
  },

  cors: {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  },

  view: {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
    defaultExtension: '.tpl',
  },

  onerror: {
    // 线上页面发生异常时，重定向到这个页面上
    errorPageUrl: '/50x.html',
    html(err, ctx) {
      // html hander
      ctx.body = `<h3>${err}</h3>`;
      ctx.status = 500;
    },
    json(err, ctx) {
      // json hander
      ctx.body = { message: err };
      ctx.status = 500;
    },
  },

  /**
     * @see http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html#createCollection
     * user: test, pwd: test, readWrite on db test
     * user: root, pwd: mongodb, readWriteAnyDatabase
     */
  mongoose: {
    url: process.env.EGG_MONGODB_URL || 'mongodb://test:test@127.0.0.1:27017/egg_news',
    options: {
      useUnifiedTopology: true,
      poolSize: 20,
    },
  },
  // database
  // redis: {
  //   client: {
  //     host: process.env.EGG_REDIS_HOST || '127.0.0.1',
  //     port: process.env.EGG_REDIS_PORT || 6379,
  //     password: process.env.EGG_REDIS_PASSWORD || 'egg_news',
  //     db: process.env.EGG_REDIS_DB || 0,
  //   },
  // },
  // image: redis:3.2-alpine
  // command: redis-server --appendonly yes --requirepass egg_news
  // volumes:
  //   - egg-redis:/data
  // networks:
  //   - docker_news
  // ports:
  //   - 6379:6379
  // plugins end

  /**
     * middleware start
     * 1.所有的这些自带中间件的配置项都通过在配置中修改中间件同名配置项进行修改
     * 2.无论是应用层加载的中间件还是框架自带中间件，都支持几个通用的配置项：
        enable：控制中间件是否开启。
        match：设置只有符合某些规则的请求才会经过这个中间件。
        ignore：设置符合某些规则的请求不经过这个中间件。
     */
  // 配置需要的中间件，数组顺序即为中间件的加载顺序
  middleware: [ 'errorHandler', 'robot', 'gzip', 'report' ],
  // [ 'robot','compress', 'gzip' ],

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

  // bodyParser: {
  //     jsonLimit: '10mb',
  // },

  // 配置 gzip 中间件的配置
  gzip: {
    match: '/static',
    threshold: 1024, // 小于 1k 的响应体不压缩
  },

  // 只对 /api 前缀的 url 路径生效
  errorHandler: {
    match: '/api',
  },
  // middleware end
};
