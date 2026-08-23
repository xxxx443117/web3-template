import { useContractAddress } from "@/contract/hooks/useContracAddress";
import { useWeb3ActiveAccount } from "@/hooks/useWeb3ActiveAccount";
import { readContract } from "@wagmi/core";
import { useConfig } from "@wagmi/vue";
import { computed, type Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { TokenAbi } from "@/contract/abis";
import type { Tokens } from "@/contract/tokens";
import { useToken } from "@/contract/hooks/useToken";

export const useTokenBalance = (tokenAddress: Ref<`0x${string}` | undefined>, accountOverride?: Ref<`0x${string}` | undefined>) => {
  const { account } = useWeb3ActiveAccount();
  const config = useConfig();
  const owner = computed(() => accountOverride?.value || account.value);

  return useQuery({
    queryKey: computed(() => ["balanceOf", tokenAddress.value, owner.value]),
    queryFn: async () => {
      if (!tokenAddress.value || !owner.value) return null;
      const data = await readContract(config, {
        address: tokenAddress.value,
        abi: TokenAbi,
        functionName: "balanceOf",
        args: [owner.value],
      });
      return data as bigint;
    },
    enabled: computed(() => !!tokenAddress.value && !!owner.value),
    refetchInterval: 10_000,
  });
};

export const useAllTokenBalances = () => {
  const { account } = useWeb3ActiveAccount();
  const { balanceTokens } = useToken();
  const config = useConfig();

  return useQuery({
    queryKey: computed(() => ["allTokenBalances", account.value, balanceTokens.value.map((t) => t.address).join(",")]),
    queryFn: async () => {
      const results: Record<string, bigint> = {};
      await Promise.all(
        balanceTokens.value.map(async (token) => {
          try {
            const data = await readContract(config, {
              address: token.address as `0x${string}`,
              abi: TokenAbi,
              functionName: "balanceOf",
              args: [account.value],
            });
            results[token.address] = data;
            results[token.symbol!] = data;
          } catch {
            results[token.address] = 0n;
            results[token.symbol!] = 0n;
          }
        }),
      );
      return results as Record<Tokens, bigint> & Record<`0x${string}`, bigint>;
    },
    enabled: computed(() => !!account.value),
    refetchInterval: 15_000,
  });
};

export const useTokenTotalSupply = (tokenAddress: Ref<`0x${string}` | undefined>) => {
  const config = useConfig();

  return useQuery({
    queryKey: computed(() => ["totalSupply", tokenAddress.value]),
    queryFn: async () => {
      if (!tokenAddress.value) return null;
      const data = await readContract(config, {
        address: tokenAddress.value,
        abi: TokenAbi,
        functionName: "totalSupply",
      });
      return data as bigint;
    },
    enabled: computed(() => !!tokenAddress.value),
  });
};

export const useTokenAllowance = (tokenAddress: Ref<`0x${string}` | undefined>, spender: Ref<`0x${string}` | undefined>) => {
  const { account } = useWeb3ActiveAccount();
  const config = useConfig();

  return useQuery({
    queryKey: computed(() => ["allowance", tokenAddress.value, account.value, spender.value]),
    queryFn: async () => {
      if (!tokenAddress.value || !account.value || !spender.value) return 0n;
      const data = await readContract(config, {
        address: tokenAddress.value,
        abi: TokenAbi,
        functionName: "allowance",
        args: [account.value, spender.value],
      });
      return data as bigint;
    },
    enabled: computed(() => !!tokenAddress.value && !!account.value && !!spender.value),
  });
};

export const useAllTokenAllowances = (spender: Ref<`0x${string}` | undefined>) => {
  const { account } = useWeb3ActiveAccount();
  const { balanceTokens } = useToken();
  const config = useConfig();

  return useQuery({
    queryKey: computed(() => ["allTokenAllowances", account.value, spender.value]),
    queryFn: async () => {
      const results: Record<string, bigint> = {};
      await Promise.all(
        balanceTokens.value.map(async (token) => {
          try {
            const data = await readContract(config, {
              address: token.address as `0x${string}`,
              abi: TokenAbi,
              functionName: "allowance",
              args: [account.value, spender.value!],
            });
            results[token.address] = data;
            results[token.symbol!] = data;
          } catch {
            results[token.address] = 0n;
            results[token.symbol!] = 0n;
          }
        }),
      );
      return results as Record<Tokens, bigint> & Record<`0x${string}`, bigint>;
    },
    enabled: computed(() => !!account.value && !!spender.value),
  });
};
