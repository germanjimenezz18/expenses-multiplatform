import { renderHook, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useGetTransactions } from "../use-get-transactions";

describe("useGetTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API with search params and converts amount from milliunits", async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(
        "from=2026-01-01&to=2026-01-31&accountId=acc-1"
      ) as never
    );

    const mockData = [
      {
        id: "txn-1",
        amount: 10_500,
        payee: "Coffee",
        notes: null,
        date: "2026-01-05",
        accountId: "acc-1",
        categoryId: "cat-1",
      },
    ];

    vi.mocked(client.api.transactions.$get).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetTransactions(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.transactions.$get).toHaveBeenCalledWith({
      query: {
        from: "2026-01-01",
        to: "2026-01-31",
        accountId: "acc-1",
      },
  });
    expect(result.current.data).toEqual([
      {
        ...mockData[0],
        amount: 10.5,
      },
    ]);
  });

  it("throws error when API response is not ok", async () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as never);

    vi.mocked(client.api.transactions.$get).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetTransactions(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Error fetching transactions");
  });
});
