<template>
  <div class="flex justify-center mt-9 mb-8 w-full text-[#777777]">
    <div ref="loader_dom"></div>

    <span v-if="props.loading" class="loading loading-spinner loading-xl"></span>

    <span v-else-if="props.load_end && props.length !== 0"> {{ t("暂无更多") }}</span>
    <Empty v-else-if="props.load_end && props.length === 0" :title="t('暂无数据')" />
  </div>
</template>

<script setup lang="ts">
import Empty from "@/components/Empty.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  loading: boolean;
  load_end: boolean;
  length: number;
  refresh?: boolean;
}>();

const emit = defineEmits(["loadMore"]);
const { t } = useI18n();

const loader_dom = ref<HTMLDivElement>();

let observer: IntersectionObserver;

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0,
};

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const { isIntersecting } = entry;
        if (isIntersecting && !props.load_end && !props.loading) {
          emit("loadMore");
        }
      });
    },
    {
      ...observerOptions,
    }
  );

  if (loader_dom.value) {
    observer.observe(loader_dom.value as HTMLDivElement);
  }
});

onUnmounted(() => {
  observer.disconnect();
});
</script>

<style scoped></style>
