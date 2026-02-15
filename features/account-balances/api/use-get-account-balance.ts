import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetAccountBalance = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["account-balance", { id }],
    queryFn: async () => {
      const response = await client.api["account-balances"][":id"].$get({
        param: { id: id! },
      });

      if (!response.ok) {
        throw new Error("Error fetching account balance");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
