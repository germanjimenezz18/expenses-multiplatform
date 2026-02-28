import { renderHook, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useGetSummary } from "../use-get-summary";

describe("useGetSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API with search params and converts all milliunit amounts", async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(
        "from=2026-01-01&to=2026-01-31&accountId=acc-1"
      ) as never
    );

    const rawSummary = {
      incomeAmount: 125_000,
      expensesAmount: 45_500,
      remainingAmount: 79_500,
      totalBalanceAmount: 1_000_000,
      categories: [
        { name: "Food", value: 25_500 },
        { name: "Transport", value: 20_000 },
      ],
      days: [
        { date: "2026-01-01", income: 50_000, expenses: 10_000 },
        { date: "2026-01-02", income: 75_000, expenses: 35_500 },
      ],
    };

    vi.mocked(client.api.summary.$get).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: rawSummary }),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetSummary(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.summary.$get).toHaveBeenCalledWith({
      query: {
        from: "2026-01-01",
        to: "2026-01-31",
        accountId: "acc-1",
      },
    });

    expect(result.current.data).toEqual({
      incomeAmount: 125,
      expensesAmount: 45.5,
      remainingAmount: 79.5,
      totalBalanceAmount: 1000,
      categories: [
        { name: "Food", value: 25.5 },
        { name: "Transport", value: 20 },
      ],
      days: [
        { date: "2026-01-01", income: 50, expenses: 10 },
        { date: "2026-01-02", income: 75, expenses: 35.5 },
      ],
    });
  });

  it("throws error when API response is not ok", async () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as never);

    vi.mocked(client.api.summary.$get).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetSummary(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Error fetching summary");
  });
});
