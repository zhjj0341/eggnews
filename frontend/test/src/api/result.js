import { request } from '@/utils/request'
window.request = request

export function getResult (params) {
  return request.get({
    url: '/api/results', params
  })
}

export function deleteResult (id) {
  return request.delete({
    url: `/api/results/${id}`
  })
}
