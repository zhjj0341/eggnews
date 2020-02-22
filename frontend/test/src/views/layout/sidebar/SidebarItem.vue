<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">
      <!-- noDropdown:true时它的url指向redirect的路径或者是第一个子路由的路径 -->
      <router-link
        v-if="!item.hidden&&item.noDropdown&&item.children.length>0"
        :to="item.redirect || joinPath([prevPath,item.path,item.children[0].path])"
        :key="'submenu'+item.name"
      >
        <el-menu-item
          :index="(item.meta && item.meta.activeSideBar) || joinPath([prevPath,item.path,item.children[0].path])"
          class="submenu-title-noDropdown"
        >
          <span>{{generateTitle(item.children[0].name)}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu
        :index="(item.meta && item.meta.activeSideBar) || item.name"
        v-if="!item.noDropdown&&!item.hidden"
        :key="'submenu'+item.name"
      >
        <template slot="title">
          <!-- 菜单图标 -->
          <i v-if="item.icon" :class="`icon iconfont icon-${item.icon}`"></i>
          <span slot="title">{{generateTitle(item.name)}}</span>
        </template>
        <template v-for="child in item.children">
          <sidebar-item
            class="nest-menu"
            v-if="!child.hidden&&child.children&&child.children.length>0"
            :parentPath="item.path"
            :routes="[child]"
            :key="item.path+'/'+child.path"
          ></sidebar-item>
          <router-link v-else :to="item.path+'/'+child.path" :key="item.path+'/'+child.path">
            <el-menu-item
              :index="(item.meta && item.meta.activeSideBar) || item.path+'/'+child.path"
            >
              <span>{{generateTitle(child.name)}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    parentPath: {
      type: String,
      default: ''
    }
  },
  methods: {
    generateTitle,
    joinPath (paths) {
      paths = paths.filter((item) => {
        return !!item
      })
      return paths.join('/')
    }
  },
  computed: {
    prevPath () {
      // 构造祖先路径, 当路由嵌套层数超过3层的时候，需要用到!item.hidden&&item.noDropdown&&item.children.length>0这种条件的路由中
      if (!this.parentPath) return ''
      return this.parentPath.startsWith('/') ? this.parentPath : `/${this.parentPath}`
    }
  }
}
</script>
