// store/useProfile.ts
import { create } from 'zustand';

import { API_URL } from '@/constants/api';
import { getToken } from '@/services/auth';

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
      const token = await getToken();
      const res = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      const token = await getToken();
      const { newPassword, ...rest } = payload;
      const body = { ...rest };
      if (newPassword) body.newPassword = newPassword;

      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
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
