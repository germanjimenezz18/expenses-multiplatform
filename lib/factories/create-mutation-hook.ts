import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

interface CreateMutationConfig {
  endpoint: string;
  method: "$post" | "$patch" | "$delete";
  queryKey: string[];
  successMessage: string;
  errorMessage: string;
  additionalInvalidateKeys?: string[][];
}

export function createMutationHook(config: CreateMutationConfig) {
  return function useResourceMutation(id?: string) {
    const queryClient = useQueryClient();

    const mutationFn = async (json?: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const endpoint = (client.api as any)[config.endpoint];

      if (config.method === "$post") {
        const response = await endpoint.$post({ json });
        return response.json();
      }
      if (config.method === "$patch" && id) {
        const response = await endpoint[":id"].$patch({
          param: { id },
          json,
        });
        return response.json();
      }
      if (config.method === "$delete" && id) {
        const response = await endpoint[":id"].$delete({
          param: { id },
        });
        return response.json();
      }
      throw new Error("Invalid mutation configuration");
    };

    const onSuccess = () => {
      toast.success(config.successMessage);
      config.queryKey.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      if (id) {
        queryClient.invalidateQueries({
          queryKey: [config.queryKey[0], { id }],
        });
      }
      config.additionalInvalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    };

    const onError = () => {
      toast.error(config.errorMessage);
    };

    return useMutation({ mutationFn, onSuccess, onError });
  };
}

interface CreateBulkMutationConfig {
  endpoint: string;
  action: string;
  queryKey: string[];
  successMessage: string;
  errorMessage: string;
  additionalInvalidateKeys?: string[][];
}

export function createBulkMutationHook(config: CreateBulkMutationConfig) {
  return function useBulkResourceMutation() {
    const queryClient = useQueryClient();

    const mutationFn = async (json: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const endpoint = (client.api as any)[config.endpoint];
      const response = await endpoint[config.action].$post({ json });
      return response.json();
    };

    const onSuccess = () => {
      toast.success(config.successMessage);
      config.queryKey.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      config.additionalInvalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    };

    const onError = () => {
      toast.error(config.errorMessage);
    };

    return useMutation({ mutationFn, onSuccess, onError });
  };
}
