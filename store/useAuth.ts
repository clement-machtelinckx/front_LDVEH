// store/useAuth.ts
import { create } from 'zustand';
import { API_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  authReady: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  init: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  isLoading: false,
  error: null,
  authReady: false,

  init: async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) {
      set({ token: storedToken });
    }
    set({ authReady: true });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

    const data = await res.json(); 

    if (!res.ok) {
      throw new Error(data.error || 'Erreur de connexion'); // ✅ utilise le vrai message du backend
    }
      await AsyncStorage.setItem('token', data.token);
      set({ token: data.token, isLoading: false });
      return true;
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      return false;
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json(); 
    if (!res.ok) {
      throw new Error(data.error || 'Erreur d\'inscription'); // ✅ utilise le vrai message du backend
    }

      set({ isLoading: false });
      return true;
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ token: null });
  },
}));
