## 词汇表（持续更新...）
| 中文 | 英文 |
| --- | --- |
| login | 登陆 |

## 项目开发规范
* 文件名，单词间用 `驼峰命名法` 连接
* CSS

```
尽量不使用 id，class 前缀如下
g 全局性
m 模块
u 组件
f 功能
```

## 目录结构
* 文件组织

```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── assets                 // 静态资源。一般图片,主题 字体。按目录分好，以下也是。
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filtres                // 全局filter
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 全局样式
+-- views 业务页面
|   +-- module-name
|   |   +-- index.vue
+-- utils
|   +-- request.js             //封装的网络请求组件
|   +-- tools.js               //公共方法
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json

```

## Build Setup

``` bash

# Install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# 打包的时候配置分测试跟生产环境的，在这个命令里是配置测试的参数，用于测试
npm run build:test

# build for production with minification,打包的时候配置有分测试跟生产环境的，在这个命令里是配置生成环境的参数，用于发布
npm run build:prod/npm run prod

```

#### 如需要修改请求的服务器地址
* 1.在访问‘#/origin’路径进行设置
* 2.在index.html文件里面引入一个包含常量如以下格式的常量的json文件或者是js文件,默认我已经生成了一个 /static/config.json文件直接修改文件下的变量就可以
```
const G_BASE_API =  ""
```

#### 资源文件打包压缩为gzip，请在服务器配置相关参数
```
location ~ ^/static/(js|css|fonts|dll)/ {
    gzip_static on;
    expires max;
    add_header Cache-Control public;
}
```

## 状态管理
后台只有user和app配置相关状态使用vuex存在全局，其它数据都由每个业务页面自己管理。

## api文档
http://api.gzdev888.com/CashBackend/dist/#

## 请求

***get请求，与后端统一了请求的格式***  
?q=name:john|op:=;date:2017-11-10 00:00:00|op:>=;date:2017-11-10 00:00:00|op:<=&orderBy=date&sortedBy=desc

查询里面的时间格式，统一为2017-11-10 00:00:00,如果传参是日期对象的，就在request里面自动转换不需要做处理，如果传参是字符串的，则需要自己在传参的时候改格式

例子
```
request.get({
  url: '/api/v1/members/sidebar/',
  params: {
    q: {
      name: 'test1',
      age: '20',
      start_at: new Date()
    }
    page:1
  }
})
```  


***q参数是查询的条件***    
```  
request.get({
  url: '/api/v1/members/sidebar/',
  params: {
    page: 1
  }
})
```  

请求链接则会解析成 /api/v1/members/sidebar/?page=1

## 自定义element主题并编译

```
cd src/styles/elementui
sass --style compressed element-variables.scss ../element.css --trace
```

### 环境变量
``` javascript
// api 地址配置格式，api跟storage用<=>隔开storage没有默认威api的storage，多个配置之间用“,”隔开
const G_BASE_API = "{{default .Env.API_PREFIX ""}}"
```