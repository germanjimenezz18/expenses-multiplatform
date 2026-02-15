import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api)["account-balances"][":id"]["$delete"]
>;

export const useDeleteAccountBalance = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      if (!id) throw new Error("ID is required");

      const response = await client.api["account-balances"][":id"].$delete({
        param: { id },
      });
      return response.json();
    },

    onSuccess: () => {
      toast.success("Balance check deleted");
      queryClient.invalidateQueries({ queryKey: ["account-balances"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error deleting balance check");
    },
  });

  return mutation;
};
