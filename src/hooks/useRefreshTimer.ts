import { onBeforeUnmount, ref } from "vue";

export const useRefreshTimer = (callback: () => void, sm = 10 * 1000) => {
  const timer = setInterval(() => {
    try {
      callback();
    } catch (error) {
      console.error(error);
    }
  }, sm);
  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
  });

  return timer;
};

const oneSecondCount = ref(0);
const oneSecondTimer = ref<NodeJS.Timeout | null>(null);
let dispatchOneSecondCount = 0;
const callbacks = ref<(() => void)[]>([]);
export const useRefreshTimerOneSecond = (callback: () => void) => {
  let calceled = false;
  const start = () => {
    oneSecondTimer.value = setInterval(() => {
      try {
        oneSecondCount.value += 1;
        callbacks.value.forEach((callback) => callback());
      } catch (error) {
        console.error(error);
      }
    }, 1000);
  };

  const stop = () => {
    if (oneSecondTimer.value) clearInterval(oneSecondTimer.value);
    oneSecondTimer.value = null;
  };

  // 记录当前有多少个 useRefreshTimerOneSecond 在运行
  dispatchOneSecondCount += 1;
  callbacks.value.push(callback);
  if (!oneSecondTimer.value) {
    start();
  }

  const cancel = async () => {
    await (async () => {
      if (calceled) return;
      dispatchOneSecondCount -= 1;
      callbacks.value = callbacks.value.filter((c) => c !== callback);
      if (dispatchOneSecondCount === 0) stop(); // 如果当前没有 useRefreshTimerOneSecond 在运行，则停止计时器
      calceled = true;
    })();
  };

  onBeforeUnmount(() => {
    cancel();
  });

  return {
    oneSecondCount,
    cancel,
  };
};
