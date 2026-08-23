<template>
  <header
    class="top-0 z-10 w-full flex items-center h-[var(--top-bar-height)] px-4 transition-all duration-300"
    :class="[routerMeta.header_fixed ? 'fixed' : 'sticky']"
    :style="{
      // backdropFilter: isShow ? 'blur(10px)' : undefined,
      boxShadow: isShow ? '0 0 10px 0 rgba(0, 0, 0, 0.1)' : undefined,
    }"
  >
    <div
      v-if="!routerMeta.back"
      class="absolute left-0 top-0 w-full h-full -z-10 transition-all duration-300"
      :class="isShow ? 'frosted-glass' : ''"
    ></div>
    <Title v-if="routerMeta.back" />

    <template v-else>
      <div class="flex items-center">
        <slot name="left">
          <template v-if="!routerMeta.isShowBack">
            <div class="flex items-center">
              <div class="mr-1">
                <Menu />
              </div>
              <div>
                <!-- <SvgIcon name="logo" class="w-[32px] h-[28px]" /> -->
                <SvgIcon name="logo" class="w-8 h-8" />
              </div>
            </div>
          </template>
          <div @click="handleBack" v-else class="w-4 h-4">
            <SvgIcon name="back" class="w-4 h-4" />
          </div>
        </slot>
      </div>

      <div class="flex-1 text-center">
        <slot name="center">
          <!-- <h1 class="text-base font-medium m-0">{{ routerMeta.title || title }}</h1> -->
        </slot>
      </div>

      <div class="flex items-center justify-end flex-1">
        <slot name="right">
          <button
            @click="switchChain"
            class="bg-transparent! shadow-none h-[26px] mr-2 border rounded px-2 py-1 text-xs text-nowrap border-black/20 dark:border-white/20"
          >
            {{ formatChainName(currentChain?.name || "BSC") }}
          </button>
          <div class="mr-2">
            <LangSelect />
          </div>
          <button
            class="flex items-center px-2 relative bg-transparent shadow-none h-[26px] border border-black/20 dark:border-white/20 rounded text-xs"
            @click="handleConnect"
          >
            <SvgIcon v-if="!shortAddress" name="wallet" class="w-4 h-4 mr-1" />
            <span class="text-nowrap">{{ shortAddress ? shortAddress : t("连接") }}</span>
            <div v-if="isWatchAccount" @click.stop="logoutWatchAccount" class="absolute top-full left-0 w-full h-full bg-red-500">
              {{ t("退出观察") }}
            </div>
          </button>
        </slot>
      </div>

      <van-popover placement="bottom-end" theme="light">
        <div class="text-xs p-4 space-y-2">
          <div v-for="item in themeList" :key="item.name" class="flex items-center" @click="setTheme(item.name)">
            <SvgIcon
              :name="item.name == themeMode ? item.active : item.icon"
              class="w-6 h-6 no-stroke"
              :class="item.name == themeMode ? 'text-transparent' : 'text-[#999999]'"
            />
            <div :class="item.name == themeMode ? 'text-purple' : 'text-[#666]'" class="pl-3 pr-2 text-nowrap">
              {{ item.label }}
            </div>
            <div :class="item.name == themeMode ? 'bg-purple' : 'border border-[#CCC]'" class="rounded-full w-2 h-2"></div>
          </div>
        </div>
        <template #reference>
          <div class="ml-2">
            <SvgIcon :name="themeMode" class="w-6 h-6 no-stroke" />
          </div>
        </template>
      </van-popover>
    </template>
  </header>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon.vue";
import { setTheme, themeMode, type ThemeMode } from "@/config/theme";
import { useScroll } from "@/hooks/useScroll";
import { useWeb3ActiveAccount } from "@/hooks/useWeb3ActiveAccount";
import { formatChainName } from "@/utils/web3";
import { useChains } from "@wagmi/vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSafeAppKit } from "@/hooks/useSafeAppKit";
import LangSelect from "./LangSelect.vue";
import Menu from "./Menu.vue";
import Title from "./Title.vue";
const { t } = useI18n();

const { shortAddress, chainId, isWatchAccount, logoutWatchAccount, isVerifyAccount, loginSign, needLoginSign } =
  useWeb3ActiveAccount();
const chains = useChains();
const router = useRouter();
const routerMeta = computed(() => router.currentRoute.value?.meta || {});

const handleBack = () => {
  router.back();
};

const { open } = useSafeAppKit();
const handleConnect = () => {
  if (needLoginSign.value) {
    loginSign();
    return;
  }
  open();
};

const currentChain = computed(() => {
  return chains.value.find((chain) => chain.id === chainId.value);
});
const switchChain = () => {
  open({ view: "Networks" });
};

defineProps<{
  title: string;
  showBack?: boolean;
  showWallet?: boolean;
}>();
const { isShow } = useScroll();

// 主题列表
const themeList = computed<{ name: ThemeMode; icon: string; active: string; label: string }[]>(() => [
  { name: "light", icon: "light-no", active: "light-active", label: t("白天") },
  { name: "dark", icon: "dark-no", active: "dark-active", label: t("黑夜") },
  { name: "auto", icon: "auto-no", active: "auto-active", label: t("系统") },
]);
</script>

<style scoped>
.wallet-btn {
  /* --border-color: var(--color-primary-30); */
  /* background: var(--border-color); */
  --border-radius: 4px;
}
/* 模拟毛玻璃效果 */
.frosted-glass {
  background-color: rgba(255, 255, 255, 0.1);
  /* 半透明白色背景 */
  /* filter: blur(10px); */
  /* 使用filter来模拟模糊效果 */
  backdrop-filter: blur(10px); /* 背景模糊 */
}
</style>
