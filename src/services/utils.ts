import type { QueryClient } from "@tanstack/vue-query";

export const stableQueryKey = (params: Record<string, unknown>): string => {
  const sorted = Object.keys(params)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = params[key];
        return acc;
      },
      {} as Record<string, unknown>,
    );
  return JSON.stringify(sorted);
};

export const invalidateQueries = (queryClient: QueryClient, ...keys: string[][]) => {
  for (const key of keys) {
    queryClient.invalidateQueries({ queryKey: key });
  }
};
