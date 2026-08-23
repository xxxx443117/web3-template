import { ref, onMounted, onUnmounted } from "vue";

import { throttle } from "lodash";

export const useScroll = () => {
  const isShow = ref(false);
  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    if (scrollTop > 30) {
      isShow.value = true;
    } else {
      isShow.value = false;
    }
  };
  const throttleScroll = throttle(onScroll, 100);

  onMounted(() => {
    window.addEventListener("scroll", throttleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", throttleScroll);
  });

  return { isShow };
};
