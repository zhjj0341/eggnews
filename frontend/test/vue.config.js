// vue.config.js
const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  },
  chainWebpack: config => {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.set('devtool', false)// 取消生成sourceMap文件
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('./src')) // key,value自行定义，比如.set('@@', resolve('src/components'))

    /**
     * 添加移动端跳转参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    config.plugin('html').tap(args => {
      if (process.env.VUE_APP_ENV_CONFIG !== 'dev') {
        // 当访问的终端是移动设备，并且不在白名单跟当前不是移动端，就自动跳转
        // `((f,t)=>{let _p=String(window.location.pathname);if(!['/qrcode/redirect','/origin','/_show'].some((i)=>_p.includes(i))&&(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))){let _o=String(window.location.origin).split('.');if(new RegExp('^(https?://)?'+t).test(_o[0])){return false}else if(_o.length > 2){_o[0]=_o[0].replace(new RegExp('^((https?)?:?//)?('+f+')?'),'$1'+t)}else{_o[0]=_o[0].replace(new RegExp('^((https?)?:?//)?(.+)'),'$1'+t+'.$3')}window.location.href=_o.join('.').replace(/\\/$/,'')}})('${from}','${to}')`
        args[0].handleMobilePage = `((f,t)=>{try{f=G_DOMAIN_HOSTS['main']||f;t=G_DOMAIN_HOSTS['mobile']||t}catch(e){};let _p=String(window.location.pathname);if(!['/qrcode/redirect','/origin','/_show'].some((i)=>_p.includes(i))&&(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))){let _o=String(window.location.origin).split('.'),_t=String(t).split('|')[0];if(new RegExp('^(https?://)?('+t+')').test(_o[0])){return false}else if(_o.length > 2){_o[0]=_o[0].replace(new RegExp('^((https?)?:?//)?('+f+')?'),'$1'+_t)}else{_o[0]=_o[0].replace(new RegExp('^((https?)?:?//)?(.+)'),'$1'+_t+'.$3')}window.location.href=_o.join('.').replace(/\\/$/,'')}})('www','h5')`
      }
      return args
    })

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-eui', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number 最小共用次数
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  configureWebpack: config => {
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    let _plugins = [
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, './static'),
          to: './static'
        }
      ])
    ]

    if (process.env.NODE_ENV === 'production') {
      var CompressionWebpackPlugin = require('compression-webpack-plugin')
      _plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          include: new RegExp(// gz压缩,(后缀名前的一段命名为config.的过滤掉)
            `\.(${['js', 'css', 'ttf'].join('|')})$`
          ),
          exclude: new RegExp(// gz压缩,(后缀名前的一段命名为config.的过滤掉)
            `\.config\.(${['js', 'css', 'ttf'].join('|')})$`
          ),
          // test: new RegExp(// gz压缩,(后缀名前的一段命名为config.的过滤掉)1
          //   `^((?!config\.).)+\.(${['js', 'css', 'ttf'].join('|')})$`
          // ),
          threshold: 0,
          minRatio: 0.8
        })
      )
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
    return {
      plugins: [
        ..._plugins
      ]
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/styles/variable.less')
      ]
    }
  }
}
