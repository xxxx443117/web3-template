import { NiubiWS } from "@/utils/NiubiWS";

export const ws = new NiubiWS({
    url: import.meta.env.VITE_BASE_API_WS_URL,
    // token: '1234567890',
})