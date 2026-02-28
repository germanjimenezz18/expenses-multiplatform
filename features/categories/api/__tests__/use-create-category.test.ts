import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useCreateCategory } from "../use-create-category";

describe("useCreateCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API, invalidates categories, and shows success toast", async () => {
    const payload = { name: "Utilities" };

    vi.mocked(client.api.categories.$post).mockResolvedValueOnce({
      json: async () => ({ id: "cat-1", ...payload }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateCategory(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(payload as never);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.categories.$post).toHaveBeenCalledWith({ json: payload });
    expect(toast.success).toHaveBeenCalledWith("Category created");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["categories"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(client.api.categories.$post).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreateCategory(), { wrapper });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ name: "Utilities" } as never)
      ).rejects.toThrow();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Error creating category");
  });
});
