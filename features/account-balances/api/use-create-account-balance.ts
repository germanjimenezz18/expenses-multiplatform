import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api)["account-balances"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api)["account-balances"]["$post"]
>["json"];

export const useCreateAccountBalance = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api["account-balances"].$post({ json });
      return response.json();
    },

    onSuccess: () => {
      toast.success("Balance check created");
      queryClient.invalidateQueries({ queryKey: ["account-balances"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("Error creating balance check");
    },
  });

  return mutation;
};
