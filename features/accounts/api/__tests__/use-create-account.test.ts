import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useCreateAccount } from "../use-create-account";

describe("useCreateAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the API with correct data and shows success toast", async () => {
    const mockResponse = { id: "1", name: "New Account" };

    vi.mocked(client.api.accounts.$post).mockResolvedValueOnce({
      json: async () => mockResponse,
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateAccount(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ name: "New Account" });
  });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.accounts.$post).toHaveBeenCalledWith({
      json: { name: "New Account" },
    });
    expect(toast.success).toHaveBeenCalledWith("Account created");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["accounts"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(client.api.accounts.$post).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreateAccount(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ name: "New Account" })).rejects.toThrow();
  });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Error creating account");
  });
});
