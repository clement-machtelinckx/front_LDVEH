// store/useErrorStore.ts
import { create } from 'zustand';

type ErrorState = {
  error: string | null;
  setError: (msg: string) => void;
  clearError: () => void;
};

export const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  setError: (msg) => set({ error: msg }),
  clearError: () => set({ error: null }),
}));
