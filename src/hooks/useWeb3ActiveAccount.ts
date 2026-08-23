import { useSafeAppKitAccount } from "@/hooks/useSafeAppKit";
import { signMessage } from "@wagmi/core";
import { useChainId, useConfig } from "@wagmi/vue";
import { isAddress, verifyMessage } from "viem";
import { computed, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { shortenAddress } from "../utils/web3";

export const VERIFY_ADDRESSES_KEY = "VERIFY_ADDRESSES_KEY";
const verifyAddresses = JSON.parse(localStorage.getItem(VERIFY_ADDRESSES_KEY) || "{}");

const state = reactive<{
  watchAccount: `0x${string}` | null;
  verifyAddresses: Record<`0x${string}`, boolean>;
  accountData: ReturnType<typeof useSafeAppKitAccount>;
}>({
  watchAccount: localStorage.getItem("watchAccount") as `0x${string}` | null,
  verifyAddresses: verifyAddresses,
  accountData: {
    address: undefined,
    isConnected: false,
    allAccounts: [],
    caipAddress: undefined,
    status: "disconnected",
  },
});

export const useWeb3ActiveAccount = () => {
  // const accountData = useAppKitAccount();
  const chainId = useChainId();
  const config = useConfig();

  const account = computed(() => {
    if (state.watchAccount && isAddress(state.watchAccount)) {
      return state.watchAccount;
    }
    if (state.verifyAddresses[state.accountData.address as `0x${string}`]) {
      return state.accountData.address as `0x${string}`;
    }
    return undefined as unknown as `0x${string}`;
  });

  const shortAddress = computed(() => {
    return account.value ? shortenAddress(account.value) : "";
  });

  const setWatchAccount = (account: `0x${string}`) => {
    state.watchAccount = account;
    localStorage.setItem("watchAccount", account);
  };

  const logoutWatchAccount = () => {
    state.watchAccount = null;
    localStorage.removeItem("watchAccount");
  };

  const isWatchAccount = computed(() => {
    return state.watchAccount && isAddress(state.watchAccount);
  });

  const isVerifyAccount = computed(() => {
    return account.value && state.verifyAddresses[account.value as `0x${string}`];
  });

  const needLoginSign = computed(() => {
    return state.accountData.address && !state.verifyAddresses[state.accountData.address as `0x${string}`];
  });

  const loginSign = async () => {
    if (!state.accountData.address) {
      return false;
    }
    if (state.verifyAddresses[state.accountData.address as `0x${string}`]) {
      return true;
    }
    // 钱包签名
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `LOGIN_SIGN_MESSAGE:${timestamp}`;

    const sign = await signMessage(config, {
      message,
    });
    const verify = await verifyMessage({
      message,
      signature: sign,
      address: state.accountData.address as `0x${string}`,
    });
    if (verify) {
      state.verifyAddresses[state.accountData.address as `0x${string}`] = true;
      localStorage.setItem(VERIFY_ADDRESSES_KEY, JSON.stringify(state.verifyAddresses));
    }
  };
  /**
   * 签名消息数据
   * @param message 签名消息
   * @returns
   */
  const signMessageData = async (message: string) => {
    if (!state.accountData.address) {
      throw new Error("No connected account");
    }
    return await signMessage(config, {
      message,
    });
  };

  // let request = false;
  // watch(() => accountData.value.address, async (value) => {
  //   console.log("accountData", value);
  //   if (value) {
  //     console.log("request", request, Date.now());
  //     // 防抖处理
  //     if (request) {
  //       return;
  //     }
  //     loginSign();
  //     request = true;
  //     setTimeout(() => {
  //       request = false;
  //     }, 1000);
  //   }
  // }, { immediate: true, deep: true });

  return {
    account,
    shortAddress,
    chainId,
    watchAccount: state.watchAccount,
    setWatchAccount,
    logoutWatchAccount,
    isWatchAccount,
    isVerifyAccount,
    needLoginSign,
    loginSign,
    signMessageData,
  };
};

export const initWatchAccount = () => {
  const route = useRoute();
  const accountData = useSafeAppKitAccount();

  const activeWebState = useWeb3ActiveAccount();

  watch(
    route,
    (value) => {
      if (value.query.watch_a && isAddress(value.query.watch_a as string)) {
        activeWebState.setWatchAccount(value.query.watch_a as `0x${string}`);
      }
    },
    { immediate: true },
  );

  watch(
    accountData,
    (value) => {
      state.accountData = value;
    },
    { immediate: true },
  );
};
