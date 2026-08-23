import { useChainId } from "@wagmi/vue";
import { bsc, bscTestnet } from "viem/chains";
import { computed } from "vue";

export const useChainHook = () => {
  const chainId = useChainId();

  const bscChainIds: number[] = [bsc.id, bscTestnet.id];
  const isBscChain = computed(() => bscChainIds.includes(chainId.value));

  return {
    chainId,
    bscChainIds,
    isBscChain,
  };
};
