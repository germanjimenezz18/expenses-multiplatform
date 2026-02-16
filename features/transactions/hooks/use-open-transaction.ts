import { create } from "zustand";

interface OpenTransactionState {
  id?: string;
  focusField?: string;
  isOpen: boolean;
  onOpen: (id: string, focusField?: string) => void;
  onClose: () => void;
}

export const useOpenTransaction = create<OpenTransactionState>((set) => ({
  id: undefined,
  focusField: undefined,
  isOpen: false,
  onOpen: (id, focusField) => set({ isOpen: true, id, focusField }),
  onClose: () => set({ isOpen: false, id: undefined, focusField: undefined }),
}));
