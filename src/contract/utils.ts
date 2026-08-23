import type { ContractKey } from "./contracts";
import { contracts } from "./contracts";

/**
 * 获取合约地址
 * @param addressKey 合约地址key
 * @param chainId 链id
 * @returns 合约地址
 */
export const getContractAddress = (addressKey: ContractKey, chainId: number): `0x${string}` | null => {
  const contract = contracts[addressKey];
  return contract.find((item) => item.chainId === chainId)?.address as `0x${string}` | null;
};
