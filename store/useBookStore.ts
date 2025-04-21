// store/useBookStore.ts
import { create } from 'zustand';
import { getToken } from '@/services/auth';

type Book = {
  id: number;
  title: string;
  description: string;
  author?: string;
  page?: string[]; // ou Page[] si tu veux typé plus finement plus tard
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
      const token = await getToken();
      if (!token) throw new Error('Aucun token trouvé');

      const res = await fetch('https://localhost:8000/api/books', {
        headers: {
          Authorization: `Bearer ${token}`,
      }});

      if (!res.ok) throw new Error(`Erreur ${res.status}`);

      const data = await res.json();

      set({ books: data.member }); // ✅ le vrai tableau est dans "member"
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ loading: false });
    }
  },
}));
