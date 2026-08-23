import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore(
  "app",
  () => {
    const sidebarOpen = ref(false);

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    return {
      sidebarOpen,
      toggleSidebar,
    };
  },
  {
    persist: {
      pick: ["sidebarOpen"],
    },
  },
);
