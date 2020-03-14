import { request } from '@/utils/request'
// 登陆
export function login (loginInfo) {
  return request.post({
    url: '/api/user/login',
    params: loginInfo
  })
}

export function logout () {
  return request.get({
    url: '/api/user/logout'
  })
}

export function getUser (loginInfo) {
  return request.post({
    url: '/api/user',
    params: loginInfo
  })
}
