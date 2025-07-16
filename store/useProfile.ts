// store/useProfile.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';

type Profile = {
  email: string;
};

type ProfileStore = {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: { email: string; newPassword?: string }) => Promise<boolean>;
};

export const useProfile = create<ProfileStore>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const token = await AsyncStorage.getItem('token');
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

  updateProfile: async ({ email, newPassword }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, newPassword }),
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
