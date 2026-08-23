export const isTest = import.meta.env.VITE_BASE_MODE === "TEST";

// Feature flags - control functionality visibility via env vars
export const isOpenStake = !!Number(import.meta.env.VITE_BASE_OPEN_STAKE);
export const isOpenWithdraw = !!Number(import.meta.env.VITE_BASE_OPEN_WITHDRAW);
