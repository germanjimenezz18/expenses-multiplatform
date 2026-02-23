import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api)["account-balances"]["bulk-create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api)["account-balances"]["bulk-create"]["$post"]
>["json"];

export const useBulkCreateBalances = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api["account-balances"][
        "bulk-create"
      ].$post({ json });
      return response.json();
    },

    onSuccess: () => {
      toast.success("Balances saved successfully");
      queryClient.invalidateQueries({ queryKey: ["account-balances"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("Error saving balances");
    },
  });

  return mutation;
};
