import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { type AppKitNetwork, bsc, bscTestnet } from "@reown/appkit/networks";
import { custom, fallback, http } from "@wagmi/core";
import { random } from "lodash";

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || "";
if (!projectId) {
  console.warn("[Web3 Template] VITE_REOWN_PROJECT_ID is not set. Wallet connection features will be disabled. Get yours at https://cloud.reown.com/");
}

const isTestnet = import.meta.env.VITE_BASE_MODE === "TEST";

// Configure supported networks - add your custom chains here
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = isTestnet ? [bscTestnet, bsc] : [bsc];

const getBscRpcUrls = () => [
  "https://bsc-dataseed.bnbchain.org",
  "https://bsc-dataseed.nariox.org",
  "https://bsc-dataseed.defibit.io",
  "https://bsc-dataseed.ninicoin.io",
  "https://bsc.nodereal.io",
  "https://bsc-dataseed-public.bnbchain.org",
];

const getBscTestRpcUrls = () => ["https://api.zan.top/bsc-testnet", "https://endpoints.omniatech.io/v1/bsc/testnet/public"];

const getTransport = (test?: boolean) => {
  const list = test ? getBscTestRpcUrls().map(http) : getBscRpcUrls().map(http);
  const index = random(0, list.length - 1);
  try {
    if (window?.ethereum?.selectedAddress) {
      return custom(window?.ethereum as any);
    }
    return list[index];
  } catch {
    return list[index];
  }
};

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  transports: {
    [bsc.id]: fallback([getTransport(), ...getBscRpcUrls().map(http)]),
    [bscTestnet.id]: fallback([getTransport(true), ...getBscTestRpcUrls().map(http)]),
  },
});
