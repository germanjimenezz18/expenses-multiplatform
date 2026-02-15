import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetLatestBalance = (accountId: string) => {
  const query = useQuery({
    queryKey: ["account-balances", "latest", accountId],
    queryFn: async () => {
      // @ts-expect-error - Route type will be available after dev server restart
      const response = await client.api["account-balances"].latest[
        ":accountId"
      ].$get({
        param: { accountId },
      });

      if (!response.ok) {
        throw new Error("Error fetching latest balance");
      }

      const { data } = await response.json();
      return data;
    },
    enabled: !!accountId,
  });
  return query;
};
