import { useAppKit, useAppKitAccount } from "@reown/appkit/vue";
import { ref } from "vue";

const appKitReady = !!import.meta.env.VITE_REOWN_PROJECT_ID;

const noop = () => {
  console.warn("[Web3 Template] VITE_REOWN_PROJECT_ID is not configured");
};

export const isAppKitReady = () => appKitReady;

export const useSafeAppKit = () => {
  if (appKitReady) {
    return useAppKit();
  }
  return { open: noop } as ReturnType<typeof useAppKit>;
};

const fallbackAccountRef = ref({
  address: undefined,
  isConnected: false,
  allAccounts: [],
  caipAddress: undefined,
  status: "disconnected" as const,
});

export const useSafeAppKitAccount = () => {
  if (appKitReady) {
    return useAppKitAccount();
  }
  return fallbackAccountRef;
};
