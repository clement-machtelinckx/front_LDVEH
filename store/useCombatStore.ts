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
  fight: (monsterId: number) => Promise<void>;
  reset: () => void;
};

export const useCombatStore = create<CombatStore>((set) => ({
  status: 'idle',
  result: null,

  fight: async (monsterId) => {
    const { adventurerId } = useAdventureStore.getState();
    const token = useAuth.getState().token;

    if (!adventurerId || !token) return;

    set({ status: 'inProgress' });

    try {
      const res = await fetch('https://localhost:8000/fight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adventurerId, monsterId }),
      });

      const data: FightResult = await res.json();

      set({
        result: data,
        status: data.winner === 'adventurer' ? 'won' : 'lost',
      });

      // Si on a gagné → relancer le fetch de la page (pour isBlocking à jour)
      if (data.winner === 'adventurer') {
        const current = useAdventureStore.getState().currentPage;
        if (current) {
          await useAdventureStore.getState().goToPage(current.pageId);
        }
      }

    } catch (err) {
      set({ status: 'idle' });
    }
  },

  reset: () => set({ status: 'idle', result: null }),
}));
