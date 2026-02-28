import { create } from "zustand";

interface NewTransactionState {
  isOpen: boolean;
  scanning: boolean;
  initialData: Record<string, unknown> | null;
  onOpen: () => void;
  onOpenScanning: () => void;
  setScanResult: (data: Record<string, unknown>) => void;
  onClose: () => void;
}

export const useNewTransaction = create<NewTransactionState>((set) => ({
  isOpen: false,
  scanning: false,
  initialData: null,
  onOpen: () => set({ isOpen: true, scanning: false, initialData: null }),
  onOpenScanning: () =>
    set({ isOpen: true, scanning: true, initialData: null }),
  setScanResult: (data) => set({ scanning: false, initialData: data }),
  onClose: () => set({ isOpen: false, scanning: false, initialData: null }),
}));
