import type { BaseError } from "viem";

const CONTRACT_ERROR_MAP: Record<string, string> = {
  UserRejectedRequestError: "User rejected the request",
  TransactionRejected: "Transaction was rejected",
  InsufficientFunds: "Insufficient funds",
  Unauthorized: "Unauthorized - check approval",
  ExecutionReverted: "Transaction execution failed",
};

export const handleContractError = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const err = error as BaseError;

    // Wagmi/Viem contract errors
    const shortMessage = err.shortMessage || err.message || "";
    for (const [key, msg] of Object.entries(CONTRACT_ERROR_MAP)) {
      if (shortMessage.includes(key) || err.name?.includes(key)) {
        return msg;
      }
    }

    // User rejection
    if (err.name === "UserRejectedRequestError" || shortMessage.includes("User rejected")) {
      return "User rejected the request";
    }

    return shortMessage || "Transaction failed";
  }

  return String(error);
};

export const handleApiError = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return err.response?.data?.message || err.message || "Request failed";
  }
  return String(error);
};
