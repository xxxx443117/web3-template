<template>
  <button
    class="w-full bg-black dark-bg-blue dark:bg-white/10 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
    @click="handleConnect"
  >
    {{ t("连接钱包") }}
  </button>
</template>

<script setup lang="ts">
import { useSafeAppKit } from "@/hooks/useSafeAppKit";
import { useWeb3ActiveAccount } from "@/hooks/useWeb3ActiveAccount";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const { open } = useSafeAppKit();
const { needLoginSign, loginSign } = useWeb3ActiveAccount();
const handleConnect = () => {
  if (needLoginSign.value) {
    loginSign();
    return;
  }
  open();
};
</script>
