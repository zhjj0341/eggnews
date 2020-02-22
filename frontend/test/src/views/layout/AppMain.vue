<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!-- 不指定include，默认所有都缓存，exclude排除不需要缓存的组件(需要再组件定义name) -->
      <keep-alive :include="cacheListName">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'AppMain',
  computed: {
    // key () {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // },
    cacheList () {
      return this.$store.state.app.cacheRoute.cacheList
    },
    cacheListName () {
      if (this.cacheList && this.cacheList.length > 0) {
        return ['ParentView', ...this.cacheList.length ? this.cacheList.map(item => item.components.default.name) : []]
      }
      return []
    }
  },
  methods: {
    ...mapMutations([
      'SET_CACHE_ROUTE'
    ])
  },
  mounted () {
    this.SET_CACHE_ROUTE(this.$route)
  },
  watch: {
    '$route' (newRoute) {
      this.SET_CACHE_ROUTE(newRoute)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-main {
  margin: 0 5px 5px;
  min-width: 700px;
}
</style>
