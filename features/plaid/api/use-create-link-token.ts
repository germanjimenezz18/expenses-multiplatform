import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";
import { convertAmountFromMiliUnits } from "@/lib/utils";

export const useCreateLinkToken = () => {
  const params = useSearchParams();
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const response = await client.api.test["create_link_token"].$post();

      if (!response.ok) {
        throw new Error("Error fetching summary");
      }

      const data = await response.json();
      return data;
    },
  });
  return query;
};
