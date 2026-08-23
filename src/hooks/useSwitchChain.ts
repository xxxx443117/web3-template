import { useSafeAppKit } from "@/hooks/useSafeAppKit";
import { useChainId, useChains } from "@wagmi/vue";
import { computed } from "vue";

export const useSwitchChainHook = () => {
  const chainId = useChainId();
  const chains = useChains();
  const currentChain = computed(() => chains.value.find((chain) => chain.id === chainId.value));
  const { open } = useSafeAppKit();
  const switchChain = () => open({ view: "Networks" });
  return {
    chainId,
    chains,
    currentChain,
    switchChain,
  };
};
