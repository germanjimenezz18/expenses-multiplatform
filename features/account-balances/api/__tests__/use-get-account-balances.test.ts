import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useGetAccountBalances } from "../use-get-account-balances";

describe("useGetAccountBalances", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API with accountId and limit query params", async () => {
    const mockData = [{ id: "bal-1", accountId: "acc-1", balance: 250_000 }];

    vi.mocked(client.api["account-balances"].$get).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetAccountBalances("acc-1", 5), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api["account-balances"].$get).toHaveBeenCalledWith({
      query: {
        accountId: "acc-1",
        limit: "5",
      },
    });
    expect(result.current.data).toEqual(mockData);
  });

  it("throws error when API response is not ok", async () => {
    vi.mocked(client.api["account-balances"].$get).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetAccountBalances("acc-1", 5), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe(
      "Error fetching account balances"
    );
  });
});
