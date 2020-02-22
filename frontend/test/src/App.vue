<template>
  <div id="app">
    <router-view></router-view>
    <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
    <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="less">
@import "~normalize.css/normalize.css"; // normalize.css 样式格式化
@import "./styles/common.less"; // 全局自定义的css样式
</style>
