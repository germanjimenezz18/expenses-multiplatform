import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useBulkDeleteTransactions } from "../use-bulk-delete-transaction";

describe("useBulkDeleteTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API, invalidates queries, and shows success toast", async () => {
    const payload = { ids: ["txn-1", "txn-2"] };

    vi.mocked(
      client.api.transactions["bulk-delete"].$post
    ).mockResolvedValueOnce({
      json: async () => ({ deleted: 2 }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useBulkDeleteTransactions(), {
      wrapper,
    });

    await act(() => {
      result.current.mutate(payload as never);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.transactions["bulk-delete"].$post).toHaveBeenCalledWith({
      json: payload,
    });
    expect(toast.success).toHaveBeenCalledWith("Transactions deleted");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["transactions"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["summary"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(
      client.api.transactions["bulk-delete"].$post
    ).mockRejectedValueOnce(new Error("Network error"));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useBulkDeleteTransactions(), {
      wrapper,
    });

    await act(() => {
      result.current.mutate({ ids: ["txn-1"] } as never);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Failed to delete transactions");
  });
});
