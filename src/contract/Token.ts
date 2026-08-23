import invariant from "tiny-invariant";

class Token {
  readonly decimals: number;
  readonly symbol?: string;
  readonly name?: string;

  readonly chainId: number;
  readonly address: `0x${string}`;
  readonly logoURL?: string;
  readonly projectLink?: string;
  readonly isChainCoin: boolean; // 是否是链币

  constructor(
    chainId: number,
    address: `0x${string}`,
    decimals: number,
    symbol?: string,
    name?: string,
    logoURL?: string,
    projectLink?: string,
    isChainCoin?: boolean,
  ) {
    this.chainId = chainId;
    this.address = address;
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
    this.logoURL = logoURL;
    this.projectLink = projectLink;
    this.isChainCoin = isChainCoin ?? false;
  }

  // static ETHERS = {
  //   [ChainId.BSC_MAINNET]: "BNB",
  //   [ChainId.BSC_TESTNET]: "BNB",
  // };

  // isETHER() {
  //   return this.address === "" && this.symbol === Token.ETHERS[this.chainId];
  // }

  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, "CHAIN_IDS");
    invariant(this.address !== other.address, "ADDRESSES");
    return this.address.toLowerCase() < other.address.toLowerCase();
  }

  public equals(other: Token): boolean {
    if (this === other) {
      return true;
    }
    return this.chainId === other.chainId && this.address === other.address;
  }

  public clone() {
    return new Token(this.chainId, this.address, this.decimals, this.symbol, this.name, this.logoURL, this.projectLink);
  }
}

export default Token;
