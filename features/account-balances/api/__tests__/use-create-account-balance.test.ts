import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useCreateAccountBalance } from "../use-create-account-balance";

describe("useCreateAccountBalance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API, invalidates queries, and shows success toast", async () => {
    const payload = {
      accountId: "acc-1",
      balance: 500_000,
      date: "2026-01-20",
      note: "Weekly check",
    };

    vi.mocked(client.api["account-balances"].$post).mockResolvedValueOnce({
      json: async () => ({ id: "bal-1" }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateAccountBalance(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(payload as never);
  });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api["account-balances"].$post).toHaveBeenCalledWith({
      json: payload,
    });
    expect(toast.success).toHaveBeenCalledWith("Balance check created");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["account-balances"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["accounts"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(client.api["account-balances"].$post).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreateAccountBalance(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ accountId: "acc-1" } as never)).rejects.toThrow();
  });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Error creating balance check");
  });
});
