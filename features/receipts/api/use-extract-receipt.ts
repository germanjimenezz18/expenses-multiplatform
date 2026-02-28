import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import type { receiptExtractionSchema } from "@/lib/ai/schemas";

type ReceiptData = z.infer<typeof receiptExtractionSchema>;
type ResponseType = { data: ReceiptData } | { error: string };

export const useExtractReceipt = () => {
  const mutation = useMutation<ResponseType, Error, { image: string }>({
    mutationFn: async (body) => {
      const response = await fetch("/api/receipts/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to extract receipt");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Receipt extracted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Error extracting receipt data");
    },
  });

  return mutation;
};
