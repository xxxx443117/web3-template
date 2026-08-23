import { getAddress, isAddress } from "viem";
import { bsc, bscTestnet } from "viem/chains";

export function shortenAddress(address: string, chars = 1): string {
  const parsed = isAddress(address);
  if (!parsed) {
    return "";
  }
  const checksummed = getAddress(address);
  return `${checksummed.substring(0, chars + 3)}...${checksummed.substring(39 - chars)}`;
}

export function shortenHash(hash: string, chars = 5) {
  return `${hash.substring(0, chars + 3)}...${hash.substring(hash.length - 2 - chars)}`;
}

const chainNameMap: Record<string, string> = {
  Ethereum: "ETH",
  "BNB Smart Chain": "BSC",
  "Binance Smart Chain Testnet": "BSC Testnet",
  "BNB Smart Chain Testnet": "BSC Testnet",
  Polygon: "MATIC",
  Arbitrum: "ARB",
  Optimism: "OP",
};

export const chainIconMap: Record<number, { name: string; icon: string }> = {
  [bsc.id]: { name: "BSC", icon: "/images/chain/bsc.png" },
  [bscTestnet.id]: { name: "BSC", icon: "/images/chain/bsc.png" },
};

export function formatChainName(chainName: string) {
  return chainNameMap[chainName] || chainName;
}

export function getBlockExplorerUrl(chainId: number, type: "tx" | "address" | "block", value: string): string {
  const baseUrls: Record<number, string> = {
    1: "https://etherscan.io",
    56: "https://bscscan.com",
    97: "https://testnet.bscscan.com",
    137: "https://polygonscan.com",
    42161: "https://arbiscan.io",
    10: "https://optimistic.etherscan.io",
    8453: "https://basescan.org",
    43114: "https://snowtrace.io",
  };

  const baseUrl = baseUrls[chainId];
  if (!baseUrl) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  return `${baseUrl}/${type}/${value}`;
}

export function openBlockExplorer(chainId: number, type: "tx" | "address" | "block", value: string) {
  const url = getBlockExplorerUrl(chainId, type, value);
  window.open(url, "_blank");
}
