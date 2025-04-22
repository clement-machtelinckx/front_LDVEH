// store/useAdventureStore.ts
import { create } from 'zustand';
import { useAuth } from './useAuth';

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
};

type AdventureState = {
  adventureId: number | null;
  adventurerId: number | null;
  currentPage: Page | null;
  startAdventure: (bookId: number, name: string) => Promise<void>;
  goToPage: (pageId: number, fromPageId?: number) => Promise<void>;
};

export const useAdventureStore = create<AdventureState>((set) => ({
  adventureId: null,
  adventurerId: null,
  currentPage: null,

  startAdventure: async (bookId, adventurerName) => {
    const token = useAuth.getState().token;
    const res = await fetch('https://localhost:8000/api/adventure/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId, adventurerName }),
    });

    const data = await res.json();
    set({
      adventureId: data.adventureId,
      adventurerId: data.adventurerId,
    });

    await useAdventureStore.getState().goToPage(data.pageId);
  },

  goToPage: async (pageId, fromPageId) => {
    const { adventurerId } = useAdventureStore.getState();
    const token = useAuth.getState().token;
    if (!adventurerId || !token) return;
  
    const url = fromPageId
      ? `https://127.0.0.1:8000/page/${pageId}/adventurer/${adventurerId}/from/${fromPageId}`
      : `https://127.0.0.1:8000/page/${pageId}/adventurer/${adventurerId}`;
  
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  
    const data = await res.json();
    set({ currentPage: data });
  },
}));
