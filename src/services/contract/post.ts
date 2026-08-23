import { useWeb3ActiveAccount } from "@/hooks/useWeb3ActiveAccount";
import { handleContractError } from "@/utils/errorHandler";
import { simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { useConfig, useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { type Ref, ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { toast } from "vue3-toastify";
import { TokenAbi } from "@/contract/abis";

export const useTokenApprove = () => {
  const config = useConfig();
  const queryClient = useQueryClient();
  const { writeContractAsync, data: hash } = useWriteContract();
  const loading = ref(false);

  const approve = async (tokenAddress: `0x${string}`, spender: `0x${string}`, amount: bigint) => {
    loading.value = true;
    const toastId = toast.loading("Approving...");
    try {
      const params = {
        address: tokenAddress,
        abi: TokenAbi,
        functionName: "approve",
        args: [spender, amount],
      } as const;

      await simulateContract(config, params);
      const txHash = await writeContractAsync(params);
      await waitForTransactionReceipt(config, { hash: txHash });

      toast.update(toastId, { type: "success", render: "Approved", isLoading: false, autoClose: 3000 });
      queryClient.invalidateQueries({ queryKey: ["allowance"] });

      return txHash;
    } catch (error) {
      const msg = handleContractError(error);
      toast.update(toastId, { type: "error", render: msg, isLoading: false, autoClose: 3000 });
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { approve, loading };
};

export const useTokenTransfer = () => {
  const config = useConfig();
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();
  const loading = ref(false);

  const transfer = async (tokenAddress: `0x${string}`, to: `0x${string}`, amount: bigint) => {
    loading.value = true;
    const toastId = toast.loading("Transferring...");
    try {
      const params = {
        address: tokenAddress,
        abi: TokenAbi,
        functionName: "transfer",
        args: [to, amount],
      } as const;

      await simulateContract(config, params);
      const txHash = await writeContractAsync(params);
      await waitForTransactionReceipt(config, { hash: txHash });

      toast.update(toastId, { type: "success", render: "Transferred", isLoading: false, autoClose: 3000 });
      queryClient.invalidateQueries({ queryKey: ["balanceOf"] });

      return txHash;
    } catch (error) {
      const msg = handleContractError(error);
      toast.update(toastId, { type: "error", render: msg, isLoading: false, autoClose: 3000 });
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { transfer, loading };
};

export const useContractWrite = () => {
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();
  const loading = ref(false);

  const execute = async (
    params: {
      address: `0x${string}`;
      abi: readonly unknown[];
      functionName: string;
      args?: readonly unknown[];
    },
    invalidateKeys?: string[][],
  ) => {
    loading.value = true;
    const toastId = toast.loading("Confirming transaction...");
    try {
      await simulateContract(config, params as any);
      const txHash = await writeContractAsync(params as any);
      await waitForTransactionReceipt(config, { hash: txHash });

      toast.update(toastId, { type: "success", render: "Transaction confirmed", isLoading: false, autoClose: 3000 });

      if (invalidateKeys) {
        const queryClient = useQueryClient();
        for (const key of invalidateKeys) {
          queryClient.invalidateQueries({ queryKey: key });
        }
      }

      return txHash;
    } catch (error) {
      const msg = handleContractError(error);
      toast.update(toastId, { type: "error", render: msg, isLoading: false, autoClose: 3000 });
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { execute, loading };
};
