<template>
  <a-layout-content :style="{
    height: '100%',
    background:'#f5f5f5' }">
    <router-view class="content"></router-view>
  </a-layout-content>
</template>
<script>
export default {
  name: 'LayoutContent',
}
</script>
<style lang="scss">
.content {
  // background-color: #f5f5f5;
  padding: 0 10px;
  // min-height: calc(100vh - 112px);
}
</style>
