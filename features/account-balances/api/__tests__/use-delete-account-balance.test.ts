import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useDeleteAccountBalance } from "../use-delete-account-balance";

describe("useDeleteAccountBalance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API, invalidates queries, and shows success toast", async () => {
    vi.mocked(
      client.api["account-balances"][":id"].$delete
    ).mockResolvedValueOnce({
      json: async () => ({ id: "bal-1" }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteAccountBalance("bal-1"), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api["account-balances"][":id"].$delete).toHaveBeenCalledWith({
      param: { id: "bal-1" },
    });
    expect(toast.success).toHaveBeenCalledWith("Balance check deleted");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["account-balances"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["accounts"] });
  });

  it("shows error toast on API failure", async () => {
    vi.mocked(
      client.api["account-balances"][":id"].$delete
    ).mockRejectedValueOnce(new Error("Network error"));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useDeleteAccountBalance("bal-1"), {
      wrapper,
    });

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Error deleting balance check");
  });

  it("shows error toast when id is missing", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useDeleteAccountBalance(undefined), {
      wrapper,
    });

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("ID is required");
    expect(toast.error).toHaveBeenCalledWith("Error deleting balance check");
    expect(
      client.api["account-balances"][":id"].$delete
    ).not.toHaveBeenCalled();
  });
});
