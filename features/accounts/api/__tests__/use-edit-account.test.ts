import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useEditAccount } from "../use-edit-account";

describe("useEditAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the API and invalidates correct query keys on success", async () => {
    vi.mocked(client.api.accounts[":id"].$patch).mockResolvedValueOnce({
      json: async () => ({ id: "1", name: "Updated" }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useEditAccount("1"), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ name: "Updated" });
  });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.accounts[":id"].$patch).toHaveBeenCalledWith({
      param: { id: "1" },
      json: { name: "Updated" },
    });
    expect(toast.success).toHaveBeenCalledWith("Account updated");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["account", { id: "1" }],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["accounts"] });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["transactions"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["summary"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(client.api.accounts[":id"].$patch).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useEditAccount("1"), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ name: "Updated" })).rejects.toThrow();
  });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Error updating account");
  });
});
