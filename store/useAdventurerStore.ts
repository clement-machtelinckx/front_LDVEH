import { create } from 'zustand';
import { API_URL } from '@/constants/api';
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
  fetchAdventurerById: (id: number) => Promise<Adventurer | null>;

  setActiveAdventurer: (adventurer: Adventurer) => void;
  clearActiveAdventurer: () => void;

  ensureActiveForAdventure: (adventureId: number) => Promise<void>;
  refreshActiveAdventurer: () => Promise<void>;
};

export const useAdventurerStore = create<AdventurerStore>((set, get) => ({
  adventurers: [],
  loading: false,
  error: null,
  activeAdventurer: null,

  // Liste complète (ton /my-adventurers)
  fetchAdventurers: async () => {
    const token = useAuth.getState().token;
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${API_URL}/my-adventurers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);

      const data: Adventurer[] = await res.json();
      set({ adventurers: data, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Erreur inconnue', loading: false });
    }
  },

  // TODO fix le fetch de active adventurer 
  
  // NEW: show by id (/adventurers/{id})
  fetchAdventurerById: async (id: number) => {
    const token = useAuth.getState().token;
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/adventurers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/ld+json',
        },
      });
      if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);

      const adv: Adventurer = await res.json();
      set({ activeAdventurer: adv, loading: false });
      return adv;
    } catch (e: any) {
      set({ error: e.message || 'Erreur inconnue', loading: false });
      return null;
    }
  },

  setActiveAdventurer: (adventurer) => set({ activeAdventurer: adventurer }),

  clearActiveAdventurer: () => set({ activeAdventurer: null }),

  // Sélectionne l’aventurier lié à une aventure (via la liste)
  ensureActiveForAdventure: async (adventureId) => {
    const { adventurers, activeAdventurer, fetchAdventurers, setActiveAdventurer } = get();

    if (activeAdventurer?.adventure?.id === adventureId) return;

    if (adventurers.length === 0) {
      await fetchAdventurers();
    }
    const fresh = get().adventurers.find(a => a.adventure?.id === adventureId);
    if (fresh) setActiveAdventurer(fresh);
  },

  
  // NEW: rafraîchit l’aventurier actif depuis l’API (utile après combat)
  refreshActiveAdventurer: async () => {
    const current = get().activeAdventurer;
    if (!current?.id) return;
    await get().fetchAdventurerById(current.id);
  },
}));
