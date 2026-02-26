import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useEditCategory } from "../use-edit-category";

describe("useEditCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API, invalidates related queries, and shows success toast", async () => {
    const payload = { name: "Updated Category" };

    vi.mocked(client.api.categories[":id"].$patch).mockResolvedValueOnce({
      json: async () => ({ id: "cat-1", ...payload }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useEditCategory("cat-1"), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(payload as never);
  });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.categories[":id"].$patch).toHaveBeenCalledWith({
      param: { id: "cat-1" },
      json: payload,
    });
    expect(toast.success).toHaveBeenCalledWith("Category updated");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["category", { id: "cat-1" }],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["categories"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["transactions"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["summary"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(client.api.categories[":id"].$patch).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useEditCategory("cat-1"), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ name: "Updated Category" } as never)).rejects.toThrow();
  });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Error updating category");
  });
});
