// store/useFeedback.ts
import { create } from 'zustand';
import { apiClient } from '@/services/apiClient';

type FeedbackState = {
  message: string;
  loading: boolean;
  success: boolean;
  error?: string;
  setMessage: (v: string) => void;
  reset: () => void;
  submit: (overridePayload?: Record<string, any>) => Promise<void>;
};


export const useFeedback = create<FeedbackState>((set, get) => ({
  message: '',
  loading: false,
  success: false,
  error: undefined,

  setMessage: (v) => set({ message: v }),
  reset: () => set({ message: '', loading: false, success: false, error: undefined }),

  // overridePayload te permet de changer/compléter la charge utile si besoin plus tard
  submit: async (overridePayload = {}) => {
    const { message } = get();

    set({ loading: true, error: undefined, success: false });
    try {
      const res = await apiClient.post('/feedback', { message, ...overridePayload }, {
        headers: {
          'Content-Type': 'application/ld+json',
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
      }

      set({ success: true });
    } catch (e: any) {
      set({ error: e?.message || 'Erreur réseau' });
    } finally {
      set({ loading: false });
    }
  },
}));
