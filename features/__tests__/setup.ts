import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import React from "react";
import { vi } from "vitest";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
}));

// Mock hono client with explicit mock functions
vi.mock("@/lib/hono", () => ({
  client: {
    api: {
      accounts: {
        $get: vi.fn(),
        $post: vi.fn(),
        ":id": {
          $get: vi.fn(),
          $patch: vi.fn(),
          $delete: vi.fn(),
        },
        "bulk-delete": {
          $post: vi.fn(),
        },
      },
      transactions: {
        $get: vi.fn(),
        $post: vi.fn(),
        ":id": {
          $get: vi.fn(),
          $patch: vi.fn(),
          $delete: vi.fn(),
        },
        "bulk-create": {
          $post: vi.fn(),
        },
        "bulk-delete": {
          $post: vi.fn(),
        },
      },
      categories: {
        $get: vi.fn(),
        $post: vi.fn(),
        ":id": {
          $get: vi.fn(),
          $patch: vi.fn(),
          $delete: vi.fn(),
        },
        "bulk-delete": {
          $post: vi.fn(),
        },
      },
      "account-balances": {
        $get: vi.fn(),
        $post: vi.fn(),
        ":id": {
          $get: vi.fn(),
          $patch: vi.fn(),
          $delete: vi.fn(),
        },
        latest: {
          ":accountId": {
            $get: vi.fn(),
          },
        },
        expected: {
          ":accountId": {
            $get: vi.fn(),
          },
        },
        "bulk-create": {
          $post: vi.fn(),
        },
      },
      summary: {
        $get: vi.fn(),
      },
    },
  },
}));

/**
 * Creates a wrapper with QueryClientProvider for testing hooks.
 */
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  }

  return { wrapper: Wrapper, queryClient };
}
