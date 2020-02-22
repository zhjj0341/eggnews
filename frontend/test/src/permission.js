import router from '@/router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
