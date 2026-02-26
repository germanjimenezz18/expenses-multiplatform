import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useDeleteCategory } from "../use-delete-category";

describe("useDeleteCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API, invalidates related queries, and shows success toast", async () => {
    vi.mocked(client.api.categories[":id"].$delete).mockResolvedValueOnce({
      json: async () => ({ id: "cat-1" }),
    } as never);

    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteCategory("cat-1"), {
      wrapper,
    });

    await act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.categories[":id"].$delete).toHaveBeenCalledWith({
      param: { id: "cat-1" },
    });
    expect(toast.success).toHaveBeenCalledWith("Category deleted successfully");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["category", { id: "cat-1" }],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["categories"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["transactions"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["summary"] });
  });

  it("shows error toast on failure", async () => {
    vi.mocked(client.api.categories[":id"].$delete).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useDeleteCategory("cat-1"), {
      wrapper,
    });

    await act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Failed to delete category");
  });
});
