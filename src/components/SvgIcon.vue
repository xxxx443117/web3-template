<template>
  <svg :class="['svg-icon', size_class]" aria-hidden="true">
    <use :xlink:href="iconPath"></use>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  name: string;
  size?: number | string;
}>();

const iconPath = computed(() => `#icon-${props.name}`);

const size_class = computed(() => {
  if (Number(props.size)) {
    return `w-${props.size} h-${props.size}`;
  }
  return;
});
</script>

<style scoped>
.svg-icon {
  /* width: 1em;
    height: 1em; */
  fill: currentColor;
  /* stroke: currentColor; */
  vertical-align: middle;
}
.svg-icon.no-stroke {
  stroke: none;
}
</style>
