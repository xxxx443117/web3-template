<script setup lang="ts">
import Header from "@/components/headers/Header.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useInitAppkit } from "./hooks/useInitAppkit";
import { initWatchAccount } from "./hooks/useWeb3ActiveAccount";
import { clearLocalStorage } from "./utils/tool";

clearLocalStorage();

useInitAppkit();
initWatchAccount();

const route = useRoute();

const bg = computed(() => {
  return route.meta.bg || "";
});
</script>

<template>
  <div class="font-pingfang">
    <Header v-if="!route.meta.hideHeader" title="" />
    <router-view v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" :key="route.path" v-if="route.meta.KeepAlive" />
      </KeepAlive>
      <component :is="Component" v-if="!route.meta.KeepAlive" />
    </router-view>
    <div class="body-bg" :class="bg"></div>
  </div>
</template>
