import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import { MotionPlugin } from "@vueuse/motion";
import { WagmiPlugin } from "@wagmi/vue";
import "virtual:svg-icons-register";
import { createApp } from "vue";
import "core-js/features/object/has-own";
import "vant/lib/index.css";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import i18n from "./lang";
import router from "./router";
import App from "./App.vue";
import "./assets/css/index.css";
import { wagmiAdapter } from "./wagmi-config";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const queryClient = new QueryClient();
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App)
  .use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig })
  .use(VueQueryPlugin, { queryClient })
  .use(i18n)
  .use(router)
  .use(pinia)
  .use(MotionPlugin)
  .use(Vue3Toastify, { autoClose: 3000 })
  .mount("#app");
