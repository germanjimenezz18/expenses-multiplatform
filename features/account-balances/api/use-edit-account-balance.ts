import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api)["account-balances"][":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api)["account-balances"][":id"]["$patch"]
>["json"];

export const useEditAccountBalance = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      if (!id) throw new Error("ID is required");

      const response = await client.api["account-balances"][":id"].$patch({
        param: { id },
        json,
      });
      return response.json();
    },

    onSuccess: () => {
      toast.success("Balance check updated");
      queryClient.invalidateQueries({ queryKey: ["account-balances"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account-balances", id] });
    },
    onError: () => {
      toast.error("Error updating balance check");
    },
  });

  return mutation;
};
