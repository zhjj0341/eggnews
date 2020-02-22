<template>
  <transition
    appear
    appear-class="f-appear"
    appear-to-class="f-appear-to"
    appear-active-class="f-appear-active"
    >
      <slot></slot>
    </transition>
</template>

<script>
export default {
}
</script>
<style lang="less" scoped>
.f-appear{
  transition: all 10s;
  // display: inline-block;
  // margin-right: 10px;
  .f-appear-to
  {
    opacity: 0;
    transform: translateY(30px);
  }
  .f-appear-active {
    position: absolute;
  }
}
</style>
