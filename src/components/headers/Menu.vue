<template>
  <div>
    <label @click="show = true">
      <SvgIcon name="menu" class="w-8 h-8" />
    </label>
    <van-popup
      v-model:show="show"
      class="h-screen shadow-[2px_0px_10px_rgba(0,0,0,1)]"
      position="left"
      teleport="body"
      :style="{ backgroundColor: 'transparent' }"
    >
      <div class="relative h-full text-white">
        <div class="frosted-glass"></div>
        <div class="z-20 text-base-content h-full py-6 text-sm w-[240px] relative">
          <div class="flex justify-between items-center pl-6 pb-8">
            <SvgIcon name="logo" class="w-10 h-10" />
            <div class="pr-6">
              <van-icon name="close" size="24" @click="show = false" />
            </div>
          </div>

          <div
            v-for="item in menuList"
            :key="item.name"
            class="flex flex-col px-6 mb-4 py-1"
            :class="{ 'bg-black dark-bg-blue dark:bg-white dark:text-black': item.href === route.path }"
          >
            <div class="flex items-center justify-start gap-2 w-full" @click="handleClick(item)">
              <SvgIcon v-if="item.icon" :name="item.icon" class="w-6 h-6 dark:text-white" />
              <span class="flex-1 dark:text-white">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon.vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const show = ref(false);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const menuList = computed(() => [
  { name: t("Welcome"), icon: "home", href: "/" },
  // Add your menu items here
]);

const handleClick = (item: { href: string; external?: boolean }) => {
  if (item.external) {
    window.open(item.href, "_blank");
  } else {
    router.push(item.href);
  }
  show.value = false;
};
</script>

<style>
.frosted-glass {
  background-color: rgba(0, 0, 0, 0.4);
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(10px);
}
</style>
