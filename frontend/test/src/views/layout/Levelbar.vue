<template>
  <div class="app-levelbar-main clearfix">
    <p class="title">{{$t(`module.${routeName}`)}}</p>
    <sub v-if="routeDesc">{{routeDesc}}</sub>
    <el-button
      v-if="canGoBack"
      class="goback"
      type="text"
      icon="iconfont icon-back"
      @click="goBack"
    >返回上一级</el-button>
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
          <router-link
            v-if="item.name && (item.redirect==='noredirect'||index==levelList.length-1)"
            to
            class="no-redirect"
          >{{generateTitle(item)}}</router-link>
          <router-link v-else :to="item.redirect||item.path">{{generateTitle(item)}}</router-link>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'levelBar',
  created () {
    this.getBreadcrumb()
  },
  data () {
    return {
      levelList: null
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    generateTitle (item) {
      const hasKey = this.$te('module.' + item.name)
      // const translatedTitle = this.$t('module.' + item.name) // $t :this method from vue-i18n, inject in @/lang/index.js

      if (hasKey) {
        return this.$t('module.' + item.name)
      }
      return item.name
    },
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'Home') {
        matched = [{ name: 'Home', path: '/' }].concat(matched)
      }
      this.levelList = matched
    },
    goBack () {
      let _route = this.$route
      if (_route.meta && _route.meta.history) {
        this.$router.replace({ name: _route.meta.history })
      } else {
        this.$router.go(-1)
      }
    }
  },
  computed: {
    routeName () {
      return this.$route.name || ''
    },
    routeDesc () {
      return this.$route.meta.desc || ''
    },
    canGoBack () {
      let _route = this.$route
      return _route.meta && _route.meta.history
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.app-levelbar-main {
  .title {
    display: inline-block;
    font-size: 20px;
    line-height: 40px;
    margin-left: 20px;
    vertical-align: middle;
  }
  .goback {
    margin: 0 10px;
    font-weight: bold;
    vertical-align: middle;
  }
  sub {
    margin-left: 5px;
    color: #666;
  }
  .app-breadcrumb.el-breadcrumb {
    float: right;
    font-size: 14px;
    line-height: 40px;
    margin-right: 20px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
}
</style>
