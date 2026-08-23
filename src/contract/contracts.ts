import { bsc, bscTestnet } from "viem/chains";

export const contracts = {
  TOKEN: [
    { chainId: bscTestnet.id, address: "0x0000000000000000000000000000000000000000" },
    { chainId: bsc.id, address: "0x0000000000000000000000000000000000000000" },
  ],
  // Add your contract addresses here, e.g.:
  // MY_NFT: [
  //   { chainId: bscTestnet.id, address: "0x..." },
  //   { chainId: bsc.id, address: "0x..." },
  // ],
} as const;

export type ContractKey = keyof typeof contracts;
