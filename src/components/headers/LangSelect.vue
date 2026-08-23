<template>
  <div class="lang-select relative">
    <div @click="toggleDropdown" class="cursor-pointer flex items-center w-6 h-6">
      <img :src="currentFlag" alt="language flag" class="w-6 h-6 rounded-full" />
    </div>

    <div v-if="isOpen" class="dropdown absolute top-full right-0 mt-1 bg-white text-black rounded-md shadow-lg z-50 w-32">
      <div
        v-for="lang in langList"
        :key="lang.value"
        @click="selectLanguage(lang.value)"
        class="flex items-center px-4 py-3 hover:bg-black cursor-pointer"
        :class="{ 'bg-black text-white': currentLang === lang.value }"
      >
        <img :src="lang.logo" alt="language flag" class="w-6 h-6 rounded-full mr-2" />
        <span class="text-sm">{{ lang.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { langList, LOCAL_STORAGE_KEY } from "@/lang";

const { locale } = useI18n();
const isOpen = ref(false);

// 当前选择的语言
const currentLang = computed(() => locale.value);

// 当前显示的国旗
const currentFlag = computed(() => {
  const lang = langList.find((l) => l.value === currentLang.value);
  return lang ? lang.logo : langList[0].logo;
});

// 切换下拉菜单显示状态
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 选择语言
const selectLanguage = (langCode: string) => {
  locale.value = langCode;
  isOpen.value = false;

  // 可以在这里添加保存用户语言偏好的逻辑
  sessionStorage.setItem(LOCAL_STORAGE_KEY, langCode);
};

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".lang-select")) {
    isOpen.value = false;
  }
};

// 组件挂载和卸载时添加/移除事件监听
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.dropdown {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
