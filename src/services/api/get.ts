import { Api } from "@/apis";
import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

export const useApiQuery = <T>(queryKey: string[], queryFn: () => Promise<T>, enabled?: Ref<boolean>) => {
  return useQuery({
    queryKey,
    queryFn,
    enabled: enabled ? computed(() => enabled.value) : undefined,
  });
};

// Example: Query that depends on account
// export const useGetUserInfo = () => {
//   const { account } = useWeb3ActiveAccount();
//   return useApiQuery(
//     computed(() => ["getUserInfo", account.value]),
//     async () => {
//       const res = await Api.SwaggerV3Api.get_api_user_getUserInfo(account.value);
//       if (!Api.isSuccess(res.data)) return null;
//       return res.data.result;
//     },
//     computed(() => !!account.value),
//   );
// };
