<template>
  <!-- <div class="absolute left-0 top-0 w-full h-[var(--top-bar-height)] z-10 transition-all duration-300" :class="isShow ? 'frosted-glass' : ''"></div> -->

  <header
    class="flex items-center justify-between w-full h-[var(--top-bar-height)] sticky top-0 z-10"
    :style="{
      backdropFilter: isShow ? 'blur(10px)' : undefined,
      // backgroundColor: isShow ? '#1b1f22' : undefined,
    }"
  >
    <!-- <div class="absolute left-0 top-0 w-full h-full -z-10 transition-all duration-300" :class="isShow ? 'frosted-glass' : ''"></div> -->
    <div @click="backHandle" class="w-16">
      <SvgIcon name="arrow-left" class="w-6 h-6" />
    </div>
    <div class="text-[20px] font-medium">
      {{ title || t(`${routerMeta.title || ""}`) }}
    </div>
    <div class="w-16 flex items-center justify-end">
      <slot></slot>
      <!-- <Filter @click="filterHandle" v-if="filter" /> -->
      <div @click="linkHandle" v-if="routerMeta.right_link">
        {{ t(`${routerMeta.right_title || ""}`) }}
        <!-- <SvgIcon name="arrow-right" /> -->
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useScroll } from "@/hooks/useScroll";
import { computed, useAttrs } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const attrs = useAttrs();

defineProps<{
  title?: string;
  filter?: boolean;
}>();
const { t } = useI18n();

const fromFather = defineEmits(["onFilter", "onBack"]);
const filterHandle = (): void => {
  fromFather("onFilter");
};

const router = useRouter();
const routerMeta: any = computed(() => router.currentRoute.value?.meta || {});
const backHandle = (): void => {
  // 点击返回键的时候 如果返回的是本网站 则调用back函数,如果不是,跳转到首页

  if (typeof attrs.onOnBack === "function") {
    fromFather("onBack");
  } else {
    router.back();
  }
};
const linkHandle = (): void => {
  router.push(routerMeta.value.right_link);
};

const { isShow } = useScroll();
</script>

<style scoped></style>
