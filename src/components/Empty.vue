<template>
  <div class="flex justify-center items-center w-full h-full flex-col">
    <SvgIcon name="empty" class="w-[160px]" />
    <div class="text-center">
      <div class="text-sm">{{ description || t("暂无数据") }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  description?: string;
}>();
</script>

<style scoped></style>
