import { useWeb3ActiveAccount } from "@/hooks/useWeb3ActiveAccount";
import { readContract, simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { useChainId, useConfig, useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { parseUnits } from "viem";
import { computed, ref, watch, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { TokenAbi } from "../abis";
import type { Tokens } from "../tokens";
import { useToken } from "./useToken";

/**
 * 获取指定地址拥有的代币数量
 * @param tokenAddress 代币地址
 * @param _account 指定地址
 * @returns 代币数量
 */
export const useTokenBalanceContract = (tokenAddress: Ref<`0x${string}`>, _account?: Ref<`0x${string}`>) => {
  const { account } = useWeb3ActiveAccount();
  const config = useConfig();

  const balance = ref(0n);

  const accountValue = computed(() => _account?.value || account.value);

  const fetchBalance = async () => {
    const data = await readContract(config, {
      address: tokenAddress.value as any,
      abi: TokenAbi,
      functionName: "balanceOf",
      args: [accountValue.value],
      // query: {
      //   enabled: computed(() => !!account || !!activeAccount.value.account),
      // },
    });

    balance.value = data;
  };

  watch(
    [tokenAddress, accountValue],
    ([value, account]) => {
      if (value && account) {
        fetchBalance();
      }
    },
    {
      immediate: true,
    },
  );

  return {
    balance,
    fetchBalance,
  };
};
/**
 * 获取代币总供应量
 * @param tokenAddress 代币地址
 * @returns 代币总供应量
 */
export const useTokenTotalSupply = (tokenAddress: Ref<`0x${string}`>) => {
  const config = useConfig();
  const totalSupply = ref(0n);

  const fetchTotalSupply = async () => {
    const data = await readContract(config, {
      address: tokenAddress.value as any,
      abi: TokenAbi,
      functionName: "totalSupply",
    });
    totalSupply.value = data;
  };

  watch(
    tokenAddress,
    ([value]) => {
      if (value) {
        fetchTotalSupply();
      }
    },
    {
      immediate: true,
    },
  );

  return {
    totalSupply,
    fetchTotalSupply,
  };
};
/**
 * 获取指定地址拥有的所有代币数量
 * @param _account 指定地址
 * @returns 指定地址拥有的所有代币数量
 */
export const useTokenAllBalanceContract = () => {
  const { account } = useWeb3ActiveAccount();
  const { balanceTokens } = useToken();
  const config = useConfig();
  const chainId = useChainId();
  const balance = ref(
    balanceTokens.value.reduce(
      (acc, token) => {
        if (token) {
          acc[token.address as `0x${string}`] = 0n;
          acc[token.symbol as Tokens] = 0n;
        }
        return acc;
      },
      {} as Record<Tokens, bigint> & Record<`0x${string}`, bigint>,
    ),
  );

  const fetchBalance = async () => {
    balanceTokens.value.map(async (token) => {
      if (token) {
        try {
          const data = await readContract(config, {
            address: token.address as `0x${string}`,
            abi: TokenAbi,
            functionName: "balanceOf",
            args: [account.value],
          });
          balance.value[token.address as `0x${string}`] = data;
          balance.value[token.symbol as Tokens] = data;
        } catch (error) {
          balance.value[token.address as `0x${string}`] = 0n;
          balance.value[token.symbol as Tokens] = 0n;
        }
      }
    });
  };

  watch(
    [account, chainId],
    ([value, chain]) => {
      if (value && chain) {
        fetchBalance();
      }
    },
    { immediate: true },
  );

  return {
    balance,
    fetchBalance,
  };
};
/**
 * 铸造代币
 * @returns
 */
export const useTokenMint = () => {
  const { writeContractAsync, isPending } = useWriteContract();

  const mint = (tokenAddress: `0x${string}`, tokenDecimals?: number) => {
    const amount = parseUnits("100000", tokenDecimals || 18);
    return writeContractAsync({
      address: tokenAddress,
      abi: TokenAbi,
      functionName: "freeMint",
      args: [amount],
    });
  };

  return {
    mint,
    isPending,
  };
};
/**
 * 获取指定地址授权代币数量
 * @param spender 指定地址
 * @returns 指定地址授权的代币数量
 */
export const useTokenAllowance = (spender: Ref<`0x${string}`>) => {
  const { account } = useWeb3ActiveAccount();
  const { balanceTokens } = useToken();
  const config = useConfig();
  const chainId = useChainId();
  const allowance = ref(
    balanceTokens.value.reduce(
      (acc, token) => {
        if (token) {
          acc[token.address as `0x${string}`] = 0n;
          acc[token.symbol as string] = 0n;
        }
        return acc;
      },
      {} as Record<Tokens, bigint> & Record<string, bigint>,
    ),
  );

  const fetchAllowance = async () => {
    balanceTokens.value.map(async (token) => {
      if (token) {
        try {
          const data = await readContract(config, {
            address: token.address as `0x${string}`,
            abi: TokenAbi,
            functionName: "allowance",
            args: [account.value, spender.value],
          });
          allowance.value[token.address as `0x${string}`] = data;
          allowance.value[token.symbol as string] = data;
        } catch (error) {
          allowance.value[token.address as `0x${string}`] = 0n;
          allowance.value[token.symbol as string] = 0n;
        }
      }
    });
  };

  watch(
    [account, spender, chainId],
    ([value, chain]) => {
      if (value && chain) {
        fetchAllowance();
      }
    },
    {
      immediate: true,
    },
  );

  return {
    allowance,
    fetchAllowance,
  };
};

/**
 * 授权代币
 * @returns
 */
export const useTokenApprove = () => {
  const config = useConfig();
  const { t } = useI18n();
  const { writeContractAsync, isPending, data: hash } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const approveLoading = ref(false);
  /**
   * 授权代币
   * @param tokenAddress 代币地址
   * @param spender 授权地址
   * @param amount 授权数量
   * @returns
   */
  const approve = async (tokenAddress: `0x${string}`, spender: `0x${string}`, amount: bigint) => {
    const loading = toast.loading(t("授权中"));
    approveLoading.value = true;
    try {
      const params = {
        address: tokenAddress,
        abi: TokenAbi,
        functionName: "approve",
        args: [spender, amount],
      } as const;
      const result = await simulateContract(config, params);
      const hash = await writeContractAsync(params);

      const receipt = await waitForTransactionReceipt(config, {
        hash,
      });
      toast.update(loading, {
        type: "success",
        render: t("授权成功"),
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(loading, {
        type: "error",
        render: t("授权失败"),
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      approveLoading.value = false;
    }
  };

  return {
    approve,
    isPending,
    isConfirming,
    isConfirmed,
    confirmError,
  };
};
