import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/hono";

// este tipo es inferido de la definición de la ruta en el servidor
type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$delete"]
>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[":id"].$delete({
        param: { id },
      });
      return response.json();
    },

    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed delete category");
    },
  });

  return mutation;
};
