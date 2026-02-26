import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useGetTransaction } from "../use-get-transaction";

describe("useGetTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns transformed transaction when API responds ok", async () => {
    const mockData = {
      id: "txn-1",
      amount: 9999,
      payee: "Book",
      notes: null,
      date: "2026-01-10",
      accountId: "acc-1",
      categoryId: "cat-1",
    };

    vi.mocked(client.api.transactions[":id"].$get).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetTransaction("txn-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.api.transactions[":id"].$get).toHaveBeenCalledWith({
      param: { id: "txn-1" },
    });
    expect(result.current.data).toEqual({
      ...mockData,
      amount: 9.999,
    });
  });

  it("throws error when API response is not ok", async () => {
    vi.mocked(client.api.transactions[":id"].$get).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetTransaction("txn-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Error fetching transaction");
  });

  it("does not call API when id is missing", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetTransaction(undefined), {
      wrapper,
    });

    await waitFor(() => expect(result.current.fetchStatus).toBe("idle"));

    expect(client.api.transactions[":id"].$get).not.toHaveBeenCalled();
  });
});
