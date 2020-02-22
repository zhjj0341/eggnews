<template>
  <div>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      background-color="#324157"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :default-active="active"
      :collapse="isCollapse"
    >
      <sidebar-item :routes="constantRouterMap"></sidebar-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { constantRouterMap } from '@/router/index'
export default {
  name: 'sidebar',
  components: {
    SidebarItem
  },
  data () {
    return {
      constantRouterMap
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse () {
      return !this.sidebar.opened
    },
    active () {
      return this.$route.meta.activeSideBar || this.$route.path
    }
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('ToggleSideBar')
    }
  }
}
</script>
