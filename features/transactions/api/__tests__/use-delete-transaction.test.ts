import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useDeleteTransaction } from "../use-delete-transaction";

describe("useDeleteTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API, invalidates queries, and shows success toast", async () => {
    vi.mocked(client.api.transactions[":id"].$delete).mockResolvedValueOnce({
      json: async () => ({ id: "txn-1" }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteTransaction("txn-1"), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.transactions[":id"].$delete).toHaveBeenCalledWith({
      param: { id: "txn-1" },
    });
    expect(toast.success).toHaveBeenCalledWith(
      "Transaction deleted successfully"
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["transaction", { id: "txn-1" }],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["transactions"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["summary"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(client.api.transactions[":id"].$delete).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useDeleteTransaction("txn-1"), {
      wrapper,
    });

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Failed to delete transaction");
  });
});
