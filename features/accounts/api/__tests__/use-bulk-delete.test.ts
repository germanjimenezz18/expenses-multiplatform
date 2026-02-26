import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useBulkDeleteAccounts } from "../use-bulk-delete";

describe("useBulkDeleteAccounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the API and invalidates accounts query key on success", async () => {
    vi.mocked(client.api.accounts["bulk-delete"].$post).mockResolvedValueOnce({
      json: async () => ({ data: ["1", "2"] }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useBulkDeleteAccounts(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ ids: ["1", "2"] });
  });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.accounts["bulk-delete"].$post).toHaveBeenCalledWith({
      json: { ids: ["1", "2"] },
    });
    expect(toast.success).toHaveBeenCalledWith("Accounts deleted");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["accounts"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(client.api.accounts["bulk-delete"].$post).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useBulkDeleteAccounts(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ ids: ["1", "2"] })).rejects.toThrow();
  });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Failed to delete accounts");
  });
});
