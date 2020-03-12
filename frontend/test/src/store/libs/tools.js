/**
 * 用onstorage来通知其他标签页更新数据
 * @param {*} type 执行的vuex的操作
 * @param {*} action 要执行的方法名
 * @param {*} data 传递的数据
 */
export function _pageTransfer ({ type, action, data }) {
  window.localStorage.setItem('_pageTransfer', JSON.stringify({
    type, action, data
  }))
}
