import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index.js";
import store from "@/store";
import { message } from 'ant-design-vue';

// 全局样式
import "@/assets/global.scss";
import "@/assets/common.scss";

function isLoggedIn() {
  return !!localStorage.getItem("token");
}
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'class';
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn()) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }, // 将目标路由的路径作为参数，登录后可以用来重定向
      });
    } else {
      next(); // 确保调用 next()
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});
const app = createApp(App);
// 在定义app的原型上用provide进行挂载
app.provide("message", message)
app.use(store).use(router).mount("#app");
