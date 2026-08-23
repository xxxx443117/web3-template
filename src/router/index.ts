import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Home from "../views/home/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home",
      header_fixed: true,
    },
  },
  // Add your routes here, e.g.:
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   component: () => import("../views/dashboard/index.vue"),
  //   meta: { title: "Dashboard", requiresAuth: true },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// Global navigation guard
router.beforeEach((to, _from, next) => {
  // Set page title
  const title = to.meta.title as string | undefined;
  if (title) {
    document.title = title;
  }

  // Auth check example:
  // const { isVerifyAccount } = useWeb3ActiveAccount();
  // if (to.meta.requiresAuth && !isVerifyAccount.value) {
  //   return next({ name: "Home" });
  // }

  next();
});

export default router;
