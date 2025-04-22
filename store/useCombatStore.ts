import { create } from 'zustand';
import { useAdventureStore } from './useAdventureStore';
import { useAuth } from './useAuth';

type FightResult = {
  adventurer: {
    adventurerName: string;
    base: number;
    roll: number;
    total: number;
  };
  monster: {
    monsterName: string;
    base: number;
    roll: number;
    total: number;
  };
  winner: 'adventurer' | 'monster';
  log: string;
};

type CombatStatus = 'idle' | 'inProgress' | 'won' | 'lost';

type CombatStore = {
  status: CombatStatus;
  result: FightResult | null;
  currentFoughtPageId: number | null; // ✅ bien inclus ici
  fight: (monsterId: number) => Promise<void>;
  reset: () => void;
};

export const useCombatStore = create<CombatStore>((set) => ({
  status: 'idle',
  result: null,
  currentFoughtPageId: null,

  fight: async (monsterId) => {
    const { adventurerId, currentPage } = useAdventureStore.getState();
    const token = useAuth.getState().token;
    if (!adventurerId || !currentPage || !token) return;

    set({ status: 'inProgress', result: null });

    try {
      const res = await fetch('https://localhost:8000/fight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adventurerId,
          monsterId,
        }),
      });

      const data = await res.json();

      const status: CombatStatus = data.winner === 'adventurer' ? 'won' : 'lost';
      set({
        status,
        result: data,
        currentFoughtPageId: currentPage.pageId,
      });
    } catch (err) {
      set({ status: 'idle', result: null, currentFoughtPageId: null });
    }
  },

  reset: () =>
    set({
      status: 'idle',
      result: null,
      currentFoughtPageId: null,
    }),
}));
