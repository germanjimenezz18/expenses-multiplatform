import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetAccountBalances = (accountId?: string, limit?: number) => {
  const query = useQuery({
    queryKey: ["account-balances", { accountId, limit }],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (accountId) params.accountId = accountId;
      if (limit) params.limit = limit.toString();

      const response = await client.api["account-balances"].$get({
        query: params,
      });

      if (!response.ok) {
        throw new Error("Error fetching account balances");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
