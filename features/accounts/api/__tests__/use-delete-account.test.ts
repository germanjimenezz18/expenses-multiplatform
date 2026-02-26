import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useDeleteAccount } from "../use-delete-account";

describe("useDeleteAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the API and invalidates correct query keys on success", async () => {
    vi.mocked(client.api.accounts[":id"].$delete).mockResolvedValueOnce({
      json: async () => ({ id: "1" }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteAccount("1"), { wrapper });

    await act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(toast.success).toHaveBeenCalledWith("Account deleted successfully");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["accounts", { id: "1" }],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["accounts"] });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["transactions"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["summary"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(client.api.accounts[":id"].$delete).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useDeleteAccount("1"), { wrapper });

    await act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Failed to delete account");
  });
});
