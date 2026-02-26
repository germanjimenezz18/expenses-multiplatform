import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useEditAccountBalance } from "../use-edit-account-balance";

describe("useEditAccountBalance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API, invalidates queries, and shows success toast", async () => {
    const payload = {
      balance: 510_000,
      date: "2026-01-21",
      note: "Updated",
    };

    vi.mocked(
      client.api["account-balances"][":id"].$patch
    ).mockResolvedValueOnce({
      json: async () => ({ id: "bal-1" }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useEditAccountBalance("bal-1"), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(payload as never);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api["account-balances"][":id"].$patch).toHaveBeenCalledWith({
      param: { id: "bal-1" },
      json: payload,
    });
    expect(toast.success).toHaveBeenCalledWith("Balance check updated");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["account-balances"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["accounts"] });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["account-balance", { id: "bal-1" }],
    });
  });

  it("shows error toast on API failure", async () => {
    vi.mocked(
      client.api["account-balances"][":id"].$patch
    ).mockRejectedValueOnce(new Error("Network error"));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useEditAccountBalance("bal-1"), {
      wrapper,
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ balance: 510_000 } as never)
      ).rejects.toThrow();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Error updating balance check");
  });

  it("shows error toast when id is missing", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useEditAccountBalance(undefined), {
      wrapper,
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ balance: 510_000 } as never)
      ).rejects.toThrow();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("ID is required");
    expect(toast.error).toHaveBeenCalledWith("Error updating balance check");
    expect(client.api["account-balances"][":id"].$patch).not.toHaveBeenCalled();
  });
});
