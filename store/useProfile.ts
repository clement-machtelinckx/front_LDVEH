// store/useProfile.ts
import { create } from 'zustand';
import { apiClient } from '@/services/apiClient';

type Profile = {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  nickname?: string;
  gender?: 'male' | 'female' | 'other' | null;
  dateOfBirth?: Date | null;
};

type ProfileStore = {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: Partial<Profile> & { newPassword?: string }) => Promise<boolean>;
};

export const useProfile = create<ProfileStore>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get('/profile', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) throw new Error('Erreur de chargement du profil');

      const data = await res.json();
      set({ profile: data, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Erreur inconnue', loading: false });
    }
  },

  updateProfile: async (payload) => {
    try {
      const { newPassword, ...rest } = payload;
      const body = { ...rest };
      if (newPassword) body.newPassword = newPassword;

      const res = await apiClient.put('/profile', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Échec de la mise à jour');
      }

      const updated = await res.json();
      set({ profile: updated });
      return true;
    } catch (e: any) {
      set({ error: e.message || 'Erreur inconnue' });
      return false;
    }
  },
}));
