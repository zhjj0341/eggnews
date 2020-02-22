import Vue from 'vue'
import Router from 'vue-router'
import { RNS } from './router_names'

/* Layout */
const Layout = () => import('@/views/layout/Layout')

const _import = file => () => import(`@/views/${file}.vue`)
// console.log(process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/**
  * icon : the icon show in the sidebar
  * hidden : if `hidden:true` will not show in the sidebar
  * redirect : if `redirect:noredirect` will not redirct in the levelbar
  * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
  * meta : `{ role: 'staff',game:'niuniu' }`  will control the page role
  * isShow: 纯展示页面
  **/
export const constantRouterMap = [
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  { path: '/', redirect: '/question', hidden: true },
  // { path: '/', name: RNS['HOME'], component: _import('dashboard/index') },
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/question',
    component: Layout,
    name: '答题管理',
    children: [
      {
        path: '',
        component: _import('question/edit'),
        name: '新增题目'
      }
    ]
  }
]

export default new Router({
  /**
   * 后端支持可开
   * location / {
      try_files $uri $uri/ /index.html;
    }
   */
  mode: 'history', // 后端支持可开
  base: __dirname,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
