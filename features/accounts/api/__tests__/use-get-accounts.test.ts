import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useGetAccounts } from "../use-get-accounts";

describe("useGetAccounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data when the API responds ok", async () => {
    const mockData = [
      { id: "1", name: "Checking", type: "depository" },
      { id: "2", name: "Savings", type: "depository" },
    ];

    vi.mocked(client.api.accounts.$get).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetAccounts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(client.api.accounts.$get).toHaveBeenCalledOnce();
  });

  it("throws error when the API fails", async () => {
    vi.mocked(client.api.accounts.$get).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetAccounts(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Error fetching /accounts");
  });
});
