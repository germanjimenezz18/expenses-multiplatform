import { create } from "zustand";

interface BalanceTrackerState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useOpenBalanceTracker = create<BalanceTrackerState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
