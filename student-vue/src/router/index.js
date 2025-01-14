import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/regist",
    name: "Regist",
    component: () => import("@/views/regist/index.vue"),
  },
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layout/index.vue"),
    redirect: "/Dashboard",
    meta: {
      title: "Layout",
      requiresAuth: true,
    },
    children: [
      {
        path: "/Dashboard",
        name: "Dashboard",
        component: () => import("@/views/Dashboard/index.vue"),
        meta: {
          title: "Dashboard", // 名称
          auth: ["user"], // 权限
          requiresAuth: true,
          // noHidden: true,  // 是否隐藏
        },
      },
      {
        path: "/Points",
        name: "Points",
        component: () => import("@/views/Points/index.vue"),
        meta: {
          title: "Points", // 名称
          auth: ["user"], // 权限
          requiresAuth: true,
          // noHidden: true,  // 是否隐藏
        },
      },
      {
        path: "/Search",
        name: "Search",
        component: () => import("@/views/Search/index.vue"),
        meta: {
          title: "Search", // 名称
          auth: ["user"], // 权限
          requiresAuth: true,
          // noHidden: true,  // 是否隐藏
        },
      },
      {
        path: "/Query",
        name: "Query",
        component: () => import("@/views/Query/index.vue"),
        meta: {
          title: "Query", // 名称
          auth: ["admin", "user"], // 权限
          requiresAuth: true,
          // noHidden: true,  // 是否隐藏
        },
      },
      {
        path: "/Profile",
        name: "Profile",
        component: () => import("@/views/Profile/index.vue"),
        meta: {
          title: "Profile", // 名称
          auth: ["user"], // 权限
          requiresAuth: true,
          // noHidden: true,  // 是否隐藏
        },
      },
      {
        path: "/UserManagement",
        name: "UserManagement",
        component: () => import("@/views/UserManagement/index.vue"),
        meta: {
          title: "User Management",
          auth: ["admin"],
          requiresAuth: true,
          // isHidden: true,
        },
      },
      {
        path: "/ClassManagement",
        name: "ClassManagement",
        component: () => import("@/views/ClassManagement/index.vue"),
        meta: {
          title: "Class Management",
          auth: ["admin"],
          requiresAuth: true,
          // isHidden: true,
        },
      },
    ],
  },
  {
    path: "/404NotFound",
    name: "NotFound",
    component: () => import("@/views/error/404NotFound.vue"),
  },
  { path: "/:pathMatch(.*)*", redirect: "/404NotFound" },
];

const router = createRouter({
  history: createWebHashHistory(),
  mode: "history",
  routes,
});

export default router;
