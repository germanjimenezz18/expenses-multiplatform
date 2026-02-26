import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useEditTransaction } from "../use-edit-transaction";

describe("useEditTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API, invalidates queries, and shows success toast", async () => {
    const payload = {
      amount: 12_000,
      payee: "Updated Payee",
      date: "2026-01-15",
      accountId: "acc-1",
      categoryId: "cat-2",
      notes: "Updated",
    };

    vi.mocked(client.api.transactions[":id"].$patch).mockResolvedValueOnce({
      json: async () => ({ id: "txn-1" }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useEditTransaction("txn-1"), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(payload as never);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.transactions[":id"].$patch).toHaveBeenCalledWith({
      param: { id: "txn-1" },
      json: payload,
    });
    expect(toast.success).toHaveBeenCalledWith("Transaction updated");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["transaction", { id: "txn-1" }],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["transactions"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["summary"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(client.api.transactions[":id"].$patch).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useEditTransaction("txn-1"), {
      wrapper,
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ amount: 1000 } as never)
      ).rejects.toThrow();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Error updating transaction");
  });
});
