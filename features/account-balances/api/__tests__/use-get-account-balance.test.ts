import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useGetAccountBalance } from "../use-get-account-balance";

describe("useGetAccountBalance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns account balance data when API responds ok", async () => {
    const mockData = { id: "bal-1", accountId: "acc-1", balance: 350_000 };

    vi.mocked(client.api["account-balances"][":id"].$get).mockResolvedValueOnce(
      {
        ok: true,
        json: async () => ({ data: mockData }),
      } as never
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetAccountBalance("bal-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api["account-balances"][":id"].$get).toHaveBeenCalledWith({
      param: { id: "bal-1" },
    });
    expect(result.current.data).toEqual(mockData);
  });

  it("throws error when API response is not ok", async () => {
    vi.mocked(client.api["account-balances"][":id"].$get).mockResolvedValueOnce(
      {
        ok: false,
        json: async () => ({}),
      } as never
    );

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetAccountBalance("bal-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe(
      "Error fetching account balance"
    );
  });

  it("does not call API when id is missing", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetAccountBalance(undefined), {
      wrapper,
    });

    await waitFor(() => expect(result.current.fetchStatus).toBe("idle"));

    expect(client.api["account-balances"][":id"].$get).not.toHaveBeenCalled();
  });
});
