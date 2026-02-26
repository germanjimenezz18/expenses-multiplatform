import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/features/__tests__/setup";
import { client } from "@/lib/hono";
import { useGetAccount } from "../use-get-account";

describe("useGetAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data when the API responds ok", async () => {
    const mockAccount = { id: "1", name: "Checking", type: "depository" };

    vi.mocked(client.api.accounts[":id"].$get).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockAccount }),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetAccount("1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockAccount);
  });

  it("does not fetch when id is undefined", () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetAccount(undefined), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("throws error when the API fails", async () => {
    vi.mocked(client.api.accounts[":id"].$get).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as never);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGetAccount("1"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Error fetching /account");
  });
});
