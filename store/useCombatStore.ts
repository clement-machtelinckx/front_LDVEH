import { create } from 'zustand';
import { apiClient } from '@/services/apiClient';
import { useAdventureStore } from './useAdventureStore';
import { useAdventurerStore } from './useAdventurerStore';

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
    if (!adventurerId || !currentPage) return;

    set({ status: 'inProgress', result: null });

    try {
      const res = await apiClient.post('/fight', {
        adventurerId,
        monsterId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      }, true); // useBaseUrl = true car /fight est sur BASE_URL

      const data = await res.json();

      const status: CombatStatus = data.winner === 'adventurer' ? 'won' : 'lost';

      const adv = useAdventurerStore.getState();
      adv.patchActive({ Endurance: data.adventurer.endurance });

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
