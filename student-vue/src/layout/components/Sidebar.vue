<template>
  <!-- <div>
   
  </div> -->
  <a-layout-sider
    :collapsed="collapsed"
    :trigger="null"
    collapsible
    class="scrollbar"
    style="width: 260px"
  >
    <a-menu
      v-if="role === 1"
      mode="inline"
      style="width: 260px"
      :items="items.filter((it) => it.role === role || it.role === 2)"
      :selectedKeys="state.selectedKeys"
      @click="handleClick"
    ></a-menu>
    <a-menu
      v-else-if="role === 2"
      mode="inline"
      style="width: 260px"
      :items="items.filter((it) => it.key === 'Query' || it.key === 'ClassManagement')"
      :selectedKeys="state.selectedKeys"
      @click="handleClick"
    ></a-menu>
    <a-menu
      v-else
      mode="inline"
      style="width: 260px"
      :items="items.filter((it) => it.role === 0 || it.role === 2)"
      :selectedKeys="state.selectedKeys"
      @click="handleClick"
    ></a-menu>
  </a-layout-sider>
</template>


<script setup>
import { reactive, watch, h, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
  FileSearchOutlined,
  CommentOutlined,
  UserOutlined,
  UsergroupDeleteOutlined,
  OrderedListOutlined,
  MenuOutlined,
} from "@ant-design/icons-vue";
const router = useRouter();
const route = useRoute();

const params = route.name.replace(/\s+/g, "");
const state = reactive({
  collapsed: false,
  selectedKeys: [params],
  openKeys: ["sub1"],
  preOpenKeys: ["sub1"],
});
const role = JSON.parse(window.localStorage.getItem("userInfo"))?.role;
const items = reactive([
  {
    key: "Dashboard",
    icon: () => h(PieChartOutlined),
    label: "Dashboard",
    title: "Dashboard",
    role: 0,
  },
  {
    key: "Points",
    icon: () => h(DesktopOutlined),
    label: "Points",
    title: "Points",
    role: 0,
  },
  {
    key: "Search",
    icon: () => h(FileSearchOutlined),
    label: "Search",
    title: "Search",
    role: 0,
  },
  {
    key: "Query",
    icon: () => h(CommentOutlined),
    label: "Query",
    title: "Query",
    role: 2,
  },
  {
    key: "Profile",
    icon: () => h(UserOutlined),
    label: "Profile",
    title: "Profile",
    role: 0,
  },
  {
    key: "UserManagement",
    icon: () => h(UsergroupDeleteOutlined),
    label: "User Management",
    title: "User Management",
    role: 1,
  },
  {
    key: "ClassManagement",
    icon: () => h(OrderedListOutlined),
    label: "Class Management",
    title: "Class Management",
    role: 1 
  }
]);
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  }
);
const handleClick = ({ key }) => {
  state.selectedKeys = [key];
  router.push(key);
};
</script>

<style lang="scss">
.ant-layout-sider {
  width: 260px !important;
  flex: 0 0 260px !important;
  min-width: 260px !important;
}
.scrollbar {
  background-color: rgb(245, 245, 245) !important;
}
.ant-menu-light {
  background-color: rgb(245, 245, 245) !important;
  border: none !important;
  .ant-menu-item {
    height: 60px !important;
    font-size: 20px;
  }
  .ant-menu-item-icon {
    font-size: 24px !important;
  }
}
</style>
