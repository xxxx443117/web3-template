import { THEME_KEY, themeMode } from "@/config/theme";
import { VERIFY_ADDRESSES_KEY } from "@/hooks/useWeb3ActiveAccount";

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time, "done"));

export const isTest = import.meta.env.VITE_BASE_MODE === "TEST";

const CLEAR_VERSION_KEY = "clearLocalStorageVersion";
const CLEAR_VERSION_VALUE = "5";

export const clearLocalStorage = (force: boolean = false) => {
  const verifyAddresses = localStorage.getItem(VERIFY_ADDRESSES_KEY);
  if (localStorage.getItem(CLEAR_VERSION_KEY) !== CLEAR_VERSION_VALUE || force) {
    localStorage.clear();
    localStorage.setItem(THEME_KEY, themeMode.value);
    localStorage.setItem(CLEAR_VERSION_KEY, CLEAR_VERSION_VALUE);
    if (verifyAddresses) {
      localStorage.setItem(VERIFY_ADDRESSES_KEY, verifyAddresses);
    }
  }
};
