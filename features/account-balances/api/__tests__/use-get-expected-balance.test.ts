import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useGetExpectedBalance } from "../use-get-expected-balance";

describe("useGetExpectedBalance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns expected balance data when API responds ok", async () => {
    const mockData = { expectedBalance: 420_000 };

    vi.mocked(
      client.api["account-balances"].expected[":accountId"].$get
    ).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetExpectedBalance("acc-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(
      client.api["account-balances"].expected[":accountId"].$get
    ).toHaveBeenCalledWith({
      param: { accountId: "acc-1" },
    });
    expect(result.current.data).toEqual(mockData);
  });

  it("throws error when API response is not ok", async () => {
    vi.mocked(
      client.api["account-balances"].expected[":accountId"].$get
    ).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetExpectedBalance("acc-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe(
      "Error fetching expected balance"
    );
  });
});
