<template>
  <a-layout>
    <Header></Header>
    <a-layout class="scrollbar">
      <Sidebar></Sidebar>
      <Content></Content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import Content from "./components/Content.vue";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";

import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";

import { ref } from "vue";
const collapsed = ref(false);
</script>

<style>
.ant-layout {
  height: 100%;
}
</style>
