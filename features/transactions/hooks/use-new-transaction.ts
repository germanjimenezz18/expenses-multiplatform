import { create } from "zustand";

interface NewTransactionState {
  /** Whether the NewTransaction sheet is currently open. */
  isOpen: boolean;

  /**
   * Whether the sheet is in "scanning" mode.
   * When `true`, the sheet renders a skeleton UI instead of the form
   * while the AI receipt extraction is in progress.
   */
  scanning: boolean;

  /**
   * Pre-fill data extracted from a scanned receipt.
   * `null` when no scan has completed yet.
   * Populated by `setScanResult` once the AI extraction succeeds;
   */
  initialData: Record<string, unknown> | null;

  /** Opens the sheet in normal mode (no scanning, no pre-fill data). */
  onOpen: () => void;

  /**
   * Opens the sheet in scanning mode.
   * Called immediately after the user selects a receipt image,
   */
  onOpenScanning: () => void;

  /**
   * Called when AI extraction succeeds.
   * Transitions the sheet out of scanning mode and stores the
   * extracted receipt data so the form can be pre-filled.
   */
  setScanResult: (data: Record<string, unknown>) => void;

  /**
   * Closes the sheet and resets all state to its initial values.
   */
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
