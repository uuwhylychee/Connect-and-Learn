<template>
  <a-layout-header class="header">
    <div class="header-left">
      <div class="logo">
        <img src="../../assets/img/logo.png" alt="" />
        <h2>Connect & Learn</h2>
      </div>
    </div>
    <div class="header-right">
      <span>{{ username }}</span>
      <a-dropdown>
        <span class="header-right-item">
          <a-avatar :src="author"></a-avatar>
        </span>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="handleLoginOut">logout</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script setup>
import avatar from "@/assets/img/avatar.jpg";
import BreadCrumb from "./BreadCrumb.vue";
import { inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const apiUrl = import.meta.env.VITE_DEV_API_BASE_URL;

const author = apiUrl + JSON.parse(window.localStorage.getItem("userInfo")).author

const message = inject("message");

const store = useStore();
const router = useRouter();

const cleanSys = () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("username");
  window.localStorage.removeItem("userInfo");
};
const handleLoginOut = () => {
  cleanSys();
  message.success("logout successfully");
  router.replace("/login");
};
const username = window.localStorage.getItem("username");
</script>

<style lang="scss">
.header {
  background: rgb(245, 245, 245) !important;
  padding: 0 !important;
  display: flex;
  justify-content: space-between;
  height: 80px !important;
  .header-left {
    display: flex;
    .logo {
      display: flex;
      flex-direction: row;
      height: 60px;
      margin-top: 10px;
      margin-left: 10px;
      align-items: center;
      img {
        height: 60px;
        margin-right: 20px;
      }
      h2{
        font-size:30px;
        font-weight:normal;
      }
    }
  }

  .header-right {
    margin: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-right-item {
      margin: 0 6px;
      cursor: pointer;

      &:hover {
        color: #1890ff;
      }
    }

    .anticon {
      font-size: 20px;
    }
  }
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}
</style>
