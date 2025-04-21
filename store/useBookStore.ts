// store/useBookStore.ts
import { create } from 'zustand';

type Book = {
  id: number;
  title: string;
  description: string;
};

type BookStore = {
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
};

export const useBookStore = create<BookStore>((set) => ({
  books: [],
  loading: false,
  error: null,

  fetchBooks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('https://localhost:8000/api/books'); // 🔁 adapte l’URL à ton back
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      set({ books: data });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ loading: false });
    }
  },
}));
