import axios from 'axios'
// import Vue from 'vue'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { eleMessage } from '@/utils/global'
import { MessageBox } from 'element-ui'
let LogOutMessageBox
let CancelToken = axios.CancelToken
// 设置请求的baseURL
axios.defaults.baseURL = G_BASE_API
// request拦截器
axios.interceptors.request.use(config => {
  // 请求头Authorization
  if (getToken()) {
    config.headers.common['Authorization'] = `Bearer ${getToken()}` // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})
axios.defaults.retry = 3 // 设置全局的请求次数，请求的间隙
axios.defaults.retryDelay = 1000
// axios.defaults.timeout = 3000
axios.interceptors.response.use( // respone拦截器
  response => {
    /**
    * code为非20000是抛错 可结合自己业务进行修改
    */
    const res = response
    // 判断一下响应中是否有 token，如果有就直接使用此 token 替换掉本地的 token。你可以根据你的业务需求自己编写更新 token 的逻辑
    let token = res.headers.authorization
    if (token) {
      // 如果 header 中存在 token，现在只从response更新token
      store.commit('SET_TOKEN', { data: { token, time: res.headers['token-refresh-at'] } })
    }
    if (res.status !== 200) {
      eleMessage({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error('error'))
    } else {
      return response.data
    }
  },
  async error => {
    let config = error.config
    if ( // 如果没有响应体证明网络或者服务器有问题,则进行重试逻辑
      !config || !config.retry || error.response
      // ['400', '401', '503', '404'].includes(String(error.response.status))
    ) return Promise.reject(error)
    config.__retryCount = config.__retryCount || 0
    config.__retryCount += 1
    if ( // 在网络异常的状态下，重试几次
      config.__retryCount >= config.retry
    ) {
      return Promise.reject(error)// Reject with the error
    }
    let backoff = new Promise(function (resolve) { // Create new promise to handle exponential backoff
      setTimeout(() => {
        resolve()
      }, config.retryDelay || 1000)
    })
    return backoff.then(() => { // Return the promise in which recalls axios to retry the request
      return axios(config)
    })
    // return Promise.reject(error)
  }
)

function wrapMethod (methodName) {
  /**
   * url 请求地址
   * params 请求参数
      request.get({
          url: '/api/v1/members/sidebar/',
          params: {
            page:1
          }
        }).then(({ err, res }) => {})
   * 如果想要自定义处理回调的逻辑也可以用‘.then()’链式处理
   * @param encryptParams 需要加密的参数列表
   */
  return async ({ url, params = {}, handleCustomError = false, successHandler, handleCancelToken, encryptParams = null }) => {
    let query = _.cloneDeep(params)
    // for (let name in query) { // 如果为空值的话,就去掉该参数
    //   if (query.hasOwnProperty(name)) {
    //     if (['', null, undefined].includes(query[name])) {
    //       delete query[name]
    //     }
    //   }
    // }
    if (methodName === 'get' || methodName === 'delete') {
      url += '?' + serialize(query)
      query = {}
    }
    // 用于取消请求的
    if (handleCancelToken && typeof handleCancelToken === 'function') {
      query.cancelToken = new CancelToken(handleCancelToken)
    }
    return axios[methodName](url, query)
      .then(function (res) {
        if (successHandler) successHandler(res)
        return {
          err: null,
          res: res.data
        }
      }).catch(function (xhr) {
        if (axios.isCancel(xhr)) {
          console.log('Request canceled', xhr.message)
          xhr.response = { statusText: xhr.message }
        } else {
          // 报错的时候会有http错误/程序Error,不是http响应错误的时候xhr是一个error对象，没有response属性
          if (!xhr.response) {
            xhr.response = {
              statusText: '网络异常，请稍候再试' // statusText: (!xhr.message || xhr.message === 'Network Error') ? '网络异常，请稍候再试' : xhr.message
            }
          }
          let message = (xhr.response && xhr.response.data && xhr.response.data.message) || xhr.response.statusText
          switch (Number(xhr.response.status)) {
            case 401:
              errorMessage(LogOutMessageBox, message)
              break
            default:
              if (!handleCustomError) {
                eleMessage({
                  message,
                  type: 'error',
                  showClose: true,
                  duration: 5 * 1000
                })
              }
              break
          }
        }
        return {
          err: xhr.response,
          res: xhr
        }
        // return Promise.reject(xhr)
      })
    // .finally((res) => {
    //   console.log('finally', res)
    //   if (common) common()
    // })
  }
}

function errorMessage (LogOutMessageBox, message) {
  if (!LogOutMessageBox) {
    store.dispatch('clearUserInfo')
    LogOutMessageBox = MessageBox.alert(message, '提示', {
      confirmButtonText: '确定',
      callback: (action, instance) => {
        store.dispatch('clearUserInfo')
        location.href = '/'
        LogOutMessageBox = null
      }
    })
  }
}

function serialize (obj) {
  let str = []

  // 连接其他参数
  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return str.join('&')
}

export const request = (() => {
  let methods = ['get', 'post', 'delete', 'put']
  let result = {}

  for (let i = 0; i < methods.length; i++) {
    let name = methods[i]
    result[name] = wrapMethod(name)
  }
  return result
})()

export const axiosInstance = axios
