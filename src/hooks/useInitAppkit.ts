import { clearLocalStorage } from "@/utils/tool";
import { createAppKit } from "@reown/appkit/vue";
import { useReconnect } from "@wagmi/vue";
import { networks, projectId, wagmiAdapter } from "../wagmi-config";

export const useInitAppkit = () => {
  if (!projectId) {
    return { modal: null };
  }

  const metadata = {
    name: "Web3 DApp",
    description: "Web3 DApp Template",
    url: location.origin,
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
  };

  const modal = createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    themeMode: "light",
    features: {
      connectMethodsOrder: ["email", "social", "wallet"],
      analytics: true,
    },
    metadata,
    enableCoinbase: false,
  });

  const { reconnect } = useReconnect();

  const onReconnect = async () => {
    try {
      clearLocalStorage(true);
      await reconnect();
    } catch {
      clearLocalStorage(true);
    }
  };

  onReconnect();

  return { modal };
};
