import { bsc, bscTestnet } from "viem/chains";
import Token from "./Token";

export const USDT = [
  new Token(bscTestnet.id, "0x0000000000000000000000000000000000000000", 18, "USDT", "Tether USD", "/images/tokens/USDT.png"),
  new Token(bsc.id, "0x0000000000000000000000000000000000000000", 18, "USDT", "Tether USD", "/images/tokens/USDT.png"),
] as const;

// Add your custom tokens here, e.g.:
// import { bsc, bscTestnet } from "viem/chains";
// export const MY_TOKEN = [
//   new Token(bscTestnet.id, "0x...", 18, "MTK", "My Token", "/images/tokens/MTK.png"),
//   new Token(bsc.id, "0x...", 18, "MTK", "My Token", "/images/tokens/MTK.png"),
// ] as const;

export const tokenAll = [...USDT];

const tokens = { USDT } as const;

export type Tokens = keyof typeof tokens;

export default tokens;
