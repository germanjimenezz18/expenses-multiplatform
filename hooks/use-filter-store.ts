import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FilterStore {
  from: string;
  to: string;
  setDates: (from: string, to: string) => void;
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const cookieStorage = {
  getItem: (name: string) => {
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  },
  setItem: (name: string, value: string) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  },
  removeItem: (name: string) => {
    document.cookie = `${name}=; path=/; max-age=0`;
  },
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      from: "",
      to: "",
      setDates: (from, to) => set({ from, to }),
    }),
    {
      name: "expense-date-filter",
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
