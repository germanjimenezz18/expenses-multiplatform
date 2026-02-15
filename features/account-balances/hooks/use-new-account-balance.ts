import { create } from "zustand";

interface NewAccountBalanceState {
  isOpen: boolean;
  accountId?: string;
  onOpen: (accountId: string) => void;
  onClose: () => void;
}

export const useNewAccountBalance = create<NewAccountBalanceState>((set) => ({
  isOpen: false,
  accountId: undefined,
  onOpen: (accountId) => set({ isOpen: true, accountId }),
  onClose: () => set({ isOpen: false, accountId: undefined }),
}));
