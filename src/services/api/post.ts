import { Api } from "@/apis";
import { handleApiError } from "@/utils/errorHandler";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { toast } from "vue3-toastify";

export const useApiMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    successMessage?: string;
    invalidateKeys?: string[][];
  },
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      if (options?.invalidateKeys) {
        for (const key of options.invalidateKeys) {
          queryClient.invalidateQueries({ queryKey: key });
        }
      }
      return data;
    },
    onError: (error) => {
      const msg = handleApiError(error);
      toast.error(msg);
    },
  });
};

// Example: Login mutation
// export const useLogin = () => {
//   return useApiMutation(
//     async (params: { address: string; signature: string }) => {
//       const res = await Api.SwaggerV3Api.post_api_auth_login(params);
//       if (!Api.isSuccess(res.data)) return null;
//       return res.data.result;
//     },
//     { successMessage: "Login successful", invalidateKeys: [["getUserInfo"]] },
//   );
// };
