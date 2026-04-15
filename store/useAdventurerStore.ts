import { create } from 'zustand';
import { apiClient } from '@/services/apiClient';


type Adventure = {
  id: number;
  book: { id: number; title: string };
  currentPage: { id: number; pageNumber: number };
  fromLastPage?: { id: number; pageNumber: number } | null;
  isFinished: boolean;
};

export type BackpackItem = {
  name: string;
  slug: string;
  type: string;
  quantity: number;
  healAmount?: number;
};

export type AdventurerSheet = {
  name: string;
  ability: number;
  endurance: number;
  maxEndurance: number;
  gold: number;
  weapons: { name: string; slug: string }[];
  specialObjects: { name: string; slug: string; slot: string | null; enduranceBonus?: number }[];
  backpack: { items: BackpackItem[]; count: number; max: number };
  skills: { name: string; slug: string; description?: string }[];
};

export type Adventurer = {
  id: number;
  AdventurerName: string;
  Ability: number;
  Endurance: number;
  gold: number;
  adventure: Adventure | null;
};

type AdventurerStore = {
  adventurers: Adventurer[];
  loading: boolean;
  error: string | null;
  activeAdventurer: Adventurer | null;
  sheet: AdventurerSheet | null;

  fetchAdventurers: () => Promise<void>;
  fetchAdventurerById: (id: number) => Promise<Adventurer | null>;
  fetchSheet: (adventurerId: number) => Promise<void>;

  setActiveAdventurer: (adventurer: Adventurer) => void;
  clearActiveAdventurer: () => void;

  ensureActiveForAdventure: (adventureId: number) => Promise<void>;
  refreshActiveAdventurer: () => Promise<void>;
  replaceActiveById: (id: number) => Promise<void>;
  patchActive: (partial: Partial<Adventurer>) => void;
};

export const useAdventurerStore = create<AdventurerStore>((set, get) => ({
  adventurers: [],
  loading: false,
  error: null,
  activeAdventurer: null,
  sheet: null,

  // Liste complète (ton /my-adventurers)
  fetchAdventurers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get('/my-adventurers', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);
      const data: Adventurer[] = await res.json();
      set({ adventurers: data, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Erreur inconnue', loading: false });
    }
  },

  replaceActiveById: async (id: number) => {
    await get().fetchAdventurerById(id); // simple alias pratique
  },
  // TODO fix le fetch de active adventurer 
  
  // NEW: show by id (/adventurers/{id})
  fetchAdventurerById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get(`/adventurers/${id}`, { headers: { Accept: 'application/ld+json' } });
      if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);

      const adv: Adventurer = await res.json();
      set({ activeAdventurer: adv, loading: false });
      return adv;
    } catch (e: any) {
      set({ error: e.message || 'Erreur inconnue', loading: false });
      return null;
    }
  },

  fetchSheet: async (adventurerId: number) => {
    try {
      const res = await apiClient.get(`/api/adventurer/${adventurerId}/sheet`, {
        headers: { Accept: 'application/json' },
      }, true); // useBaseUrl = true
      if (!res.ok) throw new Error(`Erreur sheet: ${res.status}`);
      const data: AdventurerSheet = await res.json();
      set({ sheet: data });
    } catch (e: any) {
      set({ error: e.message || 'Erreur inconnue' });
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

  patchActive: (partial) =>
    set((s) =>
      s.activeAdventurer
        ? { activeAdventurer: { ...s.activeAdventurer, ...partial } }
        : s
  ),

  
  // NEW: rafraîchit l’aventurier actif depuis l’API (utile après combat)
  refreshActiveAdventurer: async () => {
    const current = get().activeAdventurer;
    if (!current?.id) return;
    await get().fetchAdventurerById(current.id);
  },
}));
