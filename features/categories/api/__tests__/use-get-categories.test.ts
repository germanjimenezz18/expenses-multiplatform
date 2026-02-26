import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useGetCategories } from "../use-get-categories";

describe("useGetCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data when API responds ok", async () => {
    const mockData = [
      { id: "cat-1", name: "Food" },
      { id: "cat-2", name: "Transport" },
    ];

    vi.mocked(client.api.categories.$get).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetCategories(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.categories.$get).toHaveBeenCalledOnce();
    expect(result.current.data).toEqual(mockData);
  });

  it("throws error when API response is not ok", async () => {
    vi.mocked(client.api.categories.$get).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetCategories(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Error fetching /categories");
  });
});
