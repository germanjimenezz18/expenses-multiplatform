import { useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts.$get, 200>;

export type Account = ResponseType["data"][number];

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await client.api.accounts.$get();

      if (!response.ok) {
        throw new Error("Error fetching /accounts");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
