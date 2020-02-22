import Cookies from 'js-cookie'

// 检查cookie是否能够使用，华为mate10开启无痕模式会禁用cookie，导致部分功能不能使用(登陆)
let _test = 'cookie_test'
Cookies.set(_test, _test)
if (Cookies.get(_test) !== _test) alert('当前环境Cookie不可用，请检查浏览器相关设置，确保网站功能的正常使用。')
Cookies.remove(_test)

const TokenKey = 'U-Token'
const TokenRefreshAt = 'Token-Refresh-At'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken ({ time = Math.floor(Date.now() / 1000), token }) {
  let _cacheRefreshTime = Number(getTokenRefreshTime())
  if (
    !time || isNaN(_cacheRefreshTime) ||
    (time > _cacheRefreshTime)
  ) {
    // 用户关闭浏览器时会删除Cookie。
    setTokenRefreshTime(time)
    return Cookies.set(TokenKey, token)
  }
  // else {
  //   removeToken()
  //   removeTokenRefreshTime()
  // }
}

export function removeToken () {
  Cookies.remove(TokenRefreshAt)
  return Cookies.remove(TokenKey)
}

// 获取token的刷新时间
export function getTokenRefreshTime () {
  return Cookies.get(TokenRefreshAt)
}
// 设置token的刷新时间
export function setTokenRefreshTime (time) {
  // 用户关闭浏览器时会删除Cookie。
  return Cookies.set(TokenRefreshAt, time)
}
// 删除token的刷新时间
export function removeTokenRefreshTime () {
  // 用户关闭浏览器时会删除Cookie。
  return Cookies.remove(TokenRefreshAt)
}
