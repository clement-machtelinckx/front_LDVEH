import { create } from 'zustand';
import { apiClient } from '@/services/apiClient';
import { useAdventurerStore } from './useAdventurerStore';
import { getToken } from '@/services/auth';

type Choice = {
  text: string;
  nextPage: number;
  condition?: { type: string; slug: string; quantity?: number };
  available?: boolean;
  requiresDiceRoll?: boolean;
};

type DiceResult = {
  roll: number;
  nextPage: number | null;
  choiceText: string | null;
  events: any | null;
};

type Page = {
  pageId: number;
  pageNumber: number;
  content: string;
  monsterId: number | null;
  monster: any | null;
  choices: Choice[];
  bookTitle?: string;
  adventurerName?: string;
  adventurerAbility: number;
  adventurerEndurance: number;
  adventurerGold: number;
  endingType?: 'death' | 'victory';
};

type AdventureHistory = {
  bookTitle: string;
  adventurerName: string;
  finishAt: string;
};

type AdventureState = {
  adventureId: number | null;
  adventurerId: number | null;
  currentPage: Page | null;
  diceResult: DiceResult | null;

  histories: AdventureHistory[];       // global ranking
  userHistories: AdventureHistory[];   // perso

  startAdventure: (bookId: number, name: string) => Promise<void>;
  goToPage: (pageId: number, fromPageId?: number) => Promise<void>;
  rollDice: () => Promise<DiceResult | null>;

  finishAdventure: (adventureId: number) => Promise<boolean>;
  deleteAdventure: (adventureId: number) => Promise<boolean>;

  fetchHistories: () => Promise<void>;
  fetchUserHistories: (userId: number) => Promise<void>;

  clearAdventure: () => void;
  clearDiceResult: () => void;
};


export const useAdventureStore = create<AdventureState>((set) => ({
  adventureId: null,
  adventurerId: null,
  currentPage: null,
  diceResult: null,
  histories: [],
  userHistories: [],

  startAdventure: async (bookId, adventurerName) => {
    const res = await apiClient.post('/adventure/start', {
      bookId,
      adventurerName,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error(`Erreur start adventure ${res.status}`);

    const data = await res.json(); // { adventureId, adventurerId, pageId }

    // 1) mets à jour l'état local
    set({ adventureId: data.adventureId, adventurerId: data.adventurerId });

    // 2) synchronise l'aventurier actif (évite l'appel sur "22" au lieu de "23")
    await useAdventurerStore.getState().replaceActiveById(data.adventurerId);

    // 3) charge la page de départ (utilise adventurerId du store)
    await useAdventureStore.getState().goToPage(data.pageId);
  },

  goToPage: async (pageId, fromPageId) => {
    const { adventurerId } = useAdventureStore.getState();
    if (!adventurerId) return;

    const endpoint = fromPageId
      ? `/page/${pageId}/adventurer/${adventurerId}/from/${fromPageId}`
      : `/page/${pageId}/adventurer/${adventurerId}`;

    const res = await apiClient.get(endpoint, {
      headers: {
        Accept: 'application/json',
      },
    }, true); // useBaseUrl = true car /page est sur BASE_URL

    const data = await res.json();

    if (!res.ok) {
      const { useErrorStore } = await import('./useErrorStore');
      useErrorStore.getState().setError(data.error || 'Erreur inconnue');
      return;
    }

    set({ currentPage: data });
  },

  finishAdventure: async (adventureId) => {
    try {
      const res = await apiClient.post(`/adventure/${adventureId}/finish`);

      if (!res.ok) throw new Error("Erreur lors de la fin de l'aventure");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  deleteAdventure: async (adventureId) => {
    try {
      const res = await apiClient.delete(`/adventure/${adventureId}`);

      if (!res.ok) throw new Error("Erreur lors de la suppression de l'aventure");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  fetchHistories: async () => {
    try {
      const res = await apiClient.get('/adventure_histories', {
        headers: {
          Accept: 'application/ld+json',
        },
      });

      if (!res.ok) throw new Error('Erreur lors du chargement des historiques');

      const data = await res.json();
      set({ histories: data.member });
    } catch (e) {
      console.error(e);
      set({ histories: [] });
    }
  },

  fetchUserHistories: async (userId: number) => {
    if (!userId) return;

    try {
      const res = await apiClient.get(`/adventure_histories?user=/api/users/${userId}`, {
        headers: {
          Accept: 'application/ld+json',
        },
      });

      if (!res.ok) throw new Error("Erreur lors du chargement de l'historique utilisateur");

      const data = await res.json();
      set({ userHistories: data.member });
    } catch (e) {
      console.error(e);
      set({ userHistories: [] });
    }
  },


  rollDice: async () => {
    const { adventurerId } = useAdventureStore.getState();
    if (!adventurerId) return null;

    const res = await apiClient.post(`/api/adventurer/${adventurerId}/dice-roll`, undefined, {
      headers: { Accept: 'application/json' },
    }, true); // useBaseUrl = true

    if (!res.ok) return null;

    const data: DiceResult = await res.json();
    set({ diceResult: data });
    return data;
  },

  clearDiceResult: () => set({ diceResult: null }),

  clearAdventure: () => {
    set({
      adventureId: null,
      adventurerId: null,
      currentPage: null,
      diceResult: null,
    });
  },
}));
