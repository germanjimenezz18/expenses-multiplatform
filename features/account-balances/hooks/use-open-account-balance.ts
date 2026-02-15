import { create } from "zustand";

interface OpenAccountBalanceState {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useOpenAccountBalance = create<OpenAccountBalanceState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
