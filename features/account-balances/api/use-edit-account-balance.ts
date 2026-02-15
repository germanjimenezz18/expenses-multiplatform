import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/hono";

// @ts-ignore - Route type will be available after dev server restart
type ResponseType = InferResponseType<
  (typeof client.api)["account-balances"][":id"]["$patch"]
>;
// @ts-ignore - Route type will be available after dev server restart
type RequestType = InferRequestType<
  (typeof client.api)["account-balances"][":id"]["$patch"]
>["json"];

export const useEditAccountBalance = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      if (!id) throw new Error("ID is required");

      // @ts-ignore - Route type will be available after dev server restart
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
    onError: (error) => {
      console.log(error);
      toast.error("Error updating balance check");
    },
  });

  return mutation;
};
