<template>
  <div class="popup">
    <!-- 底部NFT列表 -->
    <transition name="mask-fade">
      <div
        @click="close"
        v-if="modelValue"
        class="fixed inset-0 bg-[#000000] opacity-30 z-10"
      ></div>
    </transition>
    <transition name="slide-fade">
      <div v-if="modelValue" class="fixed bottom-0 left-0 right-0 z-20">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const close = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
/* 定义底部弹窗的过渡效果 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%); /* 初始位置：底部 */
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateY(0); /* 结束位置：弹窗位于屏幕底部 */
  opacity: 1;
}

/* 定义弹窗蒙层的过渡效果 */
.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: opacity 0.3s ease;
}

.mask-fade-enter-from,
.mask-fade-leave-to {
  opacity: 0;
}

.mask-fade-enter-to,
.mask-fade-leave-from {
  opacity: 0.3;
}
</style>
