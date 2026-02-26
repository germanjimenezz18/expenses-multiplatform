import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useGetCategory } from "../use-get-category";

describe("useGetCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns category data when API responds ok", async () => {
    const mockData = { id: "cat-1", name: "Food" };

    vi.mocked(client.api.categories[":id"].$get).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetCategory("cat-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.categories[":id"].$get).toHaveBeenCalledWith({
      param: { id: "cat-1" },
    });
    expect(result.current.data).toEqual(mockData);
  });

  it("throws error when API response is not ok", async () => {
    vi.mocked(client.api.categories[":id"].$get).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetCategory("cat-1"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Error fetching /category");
  });

  it("does not call API when id is missing", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetCategory(undefined), { wrapper });

    await waitFor(() => expect(result.current.fetchStatus).toBe("idle"));

    expect(client.api.categories[":id"].$get).not.toHaveBeenCalled();
  });
});
