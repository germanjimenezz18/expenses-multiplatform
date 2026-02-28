import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { convertAmountFromMiliUnits } from "@/lib/utils/currency";

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      const response = await client.api.transactions[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Error fetching transaction");
      }

      const { data } = await response.json();
      return {
        ...data,
        amount: convertAmountFromMiliUnits(data.amount),
        items:
          data.items?.map((item) => ({
            ...item,
            totalPrice: convertAmountFromMiliUnits(item.totalPrice),
            unitPrice: item.unitPrice
              ? convertAmountFromMiliUnits(item.unitPrice)
              : undefined,
          })) ?? null,
      };
    },
  });
  return query;
};
