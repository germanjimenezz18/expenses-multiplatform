import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useBulkCreateTransactions } from "../use-bulk-create-transaction";

describe("useBulkCreateTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API, invalidates queries, and shows success toast", async () => {
    const payload = {
      transactions: [
        {
          amount: 10_000,
          payee: "Lunch",
          date: "2026-01-20",
          accountId: "acc-1",
          categoryId: "cat-1",
          notes: "Office",
        },
      ],
    };

    vi.mocked(
      client.api.transactions["bulk-create"].$post
    ).mockResolvedValueOnce({
      json: async () => ({ inserted: 1 }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useBulkCreateTransactions(), {
      wrapper,
    });

    await act(() => {
      result.current.mutate(payload as never);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.transactions["bulk-create"].$post).toHaveBeenCalledWith({
      json: payload,
    });
    expect(toast.success).toHaveBeenCalledWith("Transactions created");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["transactions"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["summary"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(
      client.api.transactions["bulk-create"].$post
    ).mockRejectedValueOnce(new Error("Network error"));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useBulkCreateTransactions(), {
      wrapper,
    });

    await act(() => {
      result.current.mutate({ transactions: [] } as never);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Failed to create transactions");
  });
});
