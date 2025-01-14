<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#004080',
      },
    }"
  >
    <router-view></router-view>
  </a-config-provider>
</template>

<script setup>
import { theme } from "ant-design-vue";
</script>

<style lang="scss">
#app {
  // min-height: 100%;
  // height: 100%; // 解决登陆界面居中问题
  width: 100%;
  height: 100%;
}
</style>
