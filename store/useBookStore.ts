// store/useBookStore.ts
import { create } from 'zustand';
import { API_URL } from '@/constants/api';
import { getToken } from '@/services/auth';
import { useAuth } from '@/store/useAuth';

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
      const token = useAuth.getState().token; // 🔥 accès direct au token Zustand
  
      if (!token) throw new Error('Aucun token trouvé');
  
      const res = await fetch(`${API_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/ld+json',
        },
      });
  
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
  
      const data = await res.json();
      set({ books: data.member });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ loading: false });
    }
  }
  
}));
