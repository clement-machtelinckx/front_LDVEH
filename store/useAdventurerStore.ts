// store/useAdventurerStore.ts
import { create } from 'zustand';
import { useAuth } from './useAuth';

type Adventure = {
  id: number;
  book: { id: number; title: string };
  currentPage: { id: number; pageNumber: number };
  fromLastPage?: { id: number; pageNumber: number } | null;
  isFinished: boolean;
};

export type Adventurer = {
  id: number;
  AdventurerName: string;
  Ability: number;
  Endurance: number;
  adventure: Adventure | null;
};

type AdventurerStore = {
  adventurers: Adventurer[];
  loading: boolean;
  error: string | null;
  activeAdventurer: Adventurer | null;

  fetchAdventurers: () => Promise<void>;
  setActiveAdventurer: (adventurer: Adventurer) => void;
  clearActiveAdventurer: () => void;
};

export const useAdventurerStore = create<AdventurerStore>((set) => ({
  adventurers: [],
  loading: false,
  error: null,
  activeAdventurer: null,

  fetchAdventurers: async () => {
    const token = useAuth.getState().token;
    set({ loading: true, error: null });

    try {
      const res = await fetch('https://localhost:8000/api/my-adventurers', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);

      const data = await res.json();
      set({ adventurers: data, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Erreur inconnue', loading: false });
    }
  },

  setActiveAdventurer: (adventurer) => {
    set({ activeAdventurer: adventurer });
  },

  clearActiveAdventurer: () => {
    set({ activeAdventurer: null });
  },
}));
