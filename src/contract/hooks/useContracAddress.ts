import { useChainId } from "@wagmi/vue";
import { computed, type ComputedRef } from "vue";

import { getContractAddress } from "../utils";
import type { ContractKey } from "../contracts";

/**
 * 获取合约地址
 * @param addressKey 合约地址key
 * @returns 合约地址
 */
export const useContractAddress = (addressKey: ContractKey) => {
  const chainId = useChainId();

  const contractAddress = computed(() => {
    return getContractAddress(addressKey, chainId.value);
  });

  return contractAddress as ComputedRef<`0x${string}`>;
};
