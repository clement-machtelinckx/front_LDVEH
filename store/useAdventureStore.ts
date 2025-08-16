import { create } from 'zustand';
import { API_URL, BASE_URL } from '@/constants/api';
import { useAdventurerStore } from './useAdventurerStore';
import { getToken } from '@/services/auth';

type Choice = {
  text: string;
  nextPage: number;
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
  adventurerAbility?: number;
  adventurerEndurance?: number;
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

  histories: AdventureHistory[];       // global ranking
  userHistories: AdventureHistory[];   // perso

  startAdventure: (bookId: number, name: string) => Promise<void>;
  goToPage: (pageId: number, fromPageId?: number) => Promise<void>;

  finishAdventure: (adventureId: number) => Promise<boolean>;
  deleteAdventure: (adventureId: number) => Promise<boolean>;

  fetchHistories: () => Promise<void>;
  fetchUserHistories: () => Promise<void>;

  clearAdventure: () => void;
};


export const useAdventureStore = create<AdventureState>((set) => ({
  adventureId: null,
  adventurerId: null,
  currentPage: null,
  histories: [],
  userHistories: [],

  startAdventure: async (bookId, adventurerName) => {
    const token = await getToken();

    const res = await fetch(`${API_URL}/adventure/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ bookId, adventurerName }),
    });

    if (!res.ok) throw new Error(`Erreur start adventure ${res.status}`);

    const data = await res.json(); // { adventureId, adventurerId, pageId }

    // 1) mets à jour l’état local
    set({ adventureId: data.adventureId, adventurerId: data.adventurerId });

    // 2) synchronise l’aventurier actif (évite l’appel sur “22” au lieu de “23”)
    await useAdventurerStore.getState().replaceActiveById(data.adventurerId);

    // 3) charge la page de départ (utilise adventurerId du store)
    await useAdventureStore.getState().goToPage(data.pageId);
  },

  goToPage: async (pageId, fromPageId) => {
    const { adventurerId } = useAdventureStore.getState();
    const token = await getToken();
    if (!adventurerId || !token) return;

    const url = fromPageId
      ? `${BASE_URL}/page/${pageId}/adventurer/${adventurerId}/from/${fromPageId}`
      : `${BASE_URL}/page/${pageId}/adventurer/${adventurerId}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const data = await res.json();
    set({ currentPage: data });
  },

  finishAdventure: async (adventureId) => {
    const token = await getToken();
    try {
      const res = await fetch(`${API_URL}/adventure/${adventureId}/finish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Erreur lors de la fin de l’aventure');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  deleteAdventure: async (adventureId) => {
    const token = await getToken();
    try {
      const res = await fetch(`${API_URL}/adventure/${adventureId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression de l’aventure');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  fetchHistories: async () => {
    const token = await getToken();
    try {
      const res = await fetch(`${API_URL}/adventure_histories`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    const token = await getToken();
    if (!token || !userId) return;

    try {
      const res = await fetch(`${API_URL}/adventure_histories?user=/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/ld+json',
        },
      });

      if (!res.ok) throw new Error('Erreur lors du chargement de l’historique utilisateur');

      const data = await res.json();
      set({ userHistories: data.member });
    } catch (e) {
      console.error(e);
      set({ userHistories: [] });
    }
  },


  clearAdventure: () => {
    set({
      adventureId: null,
      adventurerId: null,
      currentPage: null,
    });
  },
}));
