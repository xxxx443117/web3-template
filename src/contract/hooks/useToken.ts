import { useChainId } from "@wagmi/vue";
import { computed, type Ref } from "vue";
import type Token from "../Token";
import tokens, { type Tokens } from "../tokens";

export const useToken = () => {
  const chainId = useChainId();

  const unserializedTokens = () => {
    const result: { [key in Tokens]: Token | null } = {} as any;
    for (const key in tokens) {
      const token = tokens[key as Tokens].find((_token) => _token.chainId === chainId.value);
      if (token) {
        result[key as Tokens] = token;
      }
    }
    return result;
  };

  const serializedTokens = computed(() => unserializedTokens());

  const balanceTokens = computed(() => {
    return Object.values(serializedTokens.value).filter(Boolean) as Token[];
  });

  return { unserializedTokens, serializedTokens, balanceTokens };
};

export const useTokenWithAddress = (address: Ref<string>) => {
  const tokens = useToken();
  const token = computed(() => {
    return Object.values(tokens.serializedTokens.value).find(
      (token) => token?.address === address.value || (token?.symbol || "").toLowerCase() === (address.value || "").toLowerCase(),
    );
  });
  return token;
};
