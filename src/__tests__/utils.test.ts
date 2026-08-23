import { describe, expect, it } from "vitest";
import { shortenAddress, shortenHash, formatChainName } from "../utils/web3";

describe("shortenAddress", () => {
  it("should shorten a valid address with default chars", () => {
    const result = shortenAddress("0x1234567890abcdef1234567890abcdef12345678");
    expect(result).toBe("0x12...5678");
  });

  it("should shorten with custom chars", () => {
    const result = shortenAddress("0x1234567890abcdef1234567890abcdef12345678", 4);
    expect(result).toContain("0x12345");
    expect(result).toContain("5678");
  });

  it("should return empty string for invalid input", () => {
    expect(shortenAddress("")).toBe("");
    expect(shortenAddress("invalid")).toBe("");
  });
});

describe("shortenHash", () => {
  it("should shorten a hash with default chars", () => {
    const result = shortenHash("0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890");
    expect(result).toContain("...");
    expect(result.startsWith("0x")).toBe(true);
  });
});

describe("formatChainName", () => {
  it("should format BSC Smart Chain", () => {
    expect(formatChainName("BNB Smart Chain")).toBe("BSC");
  });

  it("should format Ethereum", () => {
    expect(formatChainName("Ethereum")).toBe("ETH");
  });

  it("should return original name if not matched", () => {
    expect(formatChainName("SomeNewChain")).toBe("SomeNewChain");
  });
});
