// store/useAuth.ts
import { create } from 'zustand';
import { API_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveAccessToken, saveRefreshToken, getAccessToken, getRefreshToken, clearTokens } from '@/services/auth';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  authReady: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
  logout: () => Promise<void>;
  init: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  authReady: false,

  init: async () => {
    let storedAccessToken = await getAccessToken();
    const storedRefreshToken = await getRefreshToken();
    
    // Migration: si on trouve l'ancien token, on le migre
    const oldToken = await AsyncStorage.getItem('token');
    if (oldToken && !storedAccessToken) {
      await saveAccessToken(oldToken);
      await AsyncStorage.removeItem('token');
      storedAccessToken = oldToken;
    }

    set({
      token: storedAccessToken ?? null,
      refreshToken: storedRefreshToken ?? null,
    });

    // Au redemarrage, si l'access token est absent mais qu'un refresh token existe,
    // tenter un refresh pour restaurer automatiquement la session.
    if (!storedAccessToken && storedRefreshToken) {
      await get().refreshAccessToken();
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

      // Vérifier si c'est une erreur CORS
      if (res.status === 0 || (res.type === 'opaque' && !res.ok)) {
        throw new Error('Erreur CORS : Le serveur ne permet pas les requêtes depuis cette origine. Veuillez configurer CORS côté backend ou tester sur mobile (npm run android/ios).');
      }

      const data = await res.json(); 

      if (!res.ok) {
        throw new Error(data.error || 'Erreur de connexion'); 
      }
      
      // Sauvegarder les deux tokens
      await saveAccessToken(data.token);
      await saveRefreshToken(data.refresh_token);
      
      set({ 
        token: data.token, 
        refreshToken: data.refresh_token,
        isLoading: false 
      });
      return true;
    } catch (e: any) {
      // Améliorer le message d'erreur pour les erreurs réseau/CORS
      let errorMessage = e.message;
      if (e.message.includes('Failed to fetch') || e.message.includes('CORS') || e.message.includes('network')) {
        errorMessage = 'Erreur CORS : Le serveur ne permet pas les requêtes depuis cette origine. Veuillez configurer CORS côté backend ou tester sur mobile (npm run android/ios).';
      }
      set({ error: errorMessage, isLoading: false });
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
        throw new Error(data.error || 'Erreur d\'inscription'); 
      }

      set({ isLoading: false });
      return true;
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      return false;
    }
  },

  refreshAccessToken: async () => {
    // Toujours lire le refresh token depuis AsyncStorage (source de vérité)
    // pour éviter les problèmes de synchronisation avec le store
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      set({ error: 'Aucun refresh token disponible' });
      return false;
    }

    try {
      const res = await fetch(`${API_URL}/token/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Si le refresh token est invalide, déconnecter l'utilisateur
        await get().logout();
        throw new Error(data.error || data.message || 'Erreur de rafraîchissement du token');
      }

      // Vérifier que les tokens sont présents dans la réponse
      if (!data.token) {
        throw new Error('Token manquant dans la réponse du serveur');
      }

      // D'après votre API, le backend retourne TOUJOURS un nouveau refresh_token
      // C'est obligatoire car l'ancien refresh_token est invalidé après utilisation
      if (!data.refresh_token) {
        throw new Error('Le backend doit retourner un nouveau refresh_token');
      }

      // Sauvegarder les nouveaux tokens
      // IMPORTANT: Sauvegarder d'abord le refresh_token, puis l'access_token
      // pour éviter les problèmes de timing si plusieurs refresh sont déclenchés
      await saveRefreshToken(data.refresh_token);
      await saveAccessToken(data.token);
      
      // Mettre à jour le store avec les nouveaux tokens
      set({ 
        token: data.token, 
        refreshToken: data.refresh_token
      });
      
      return true;
    } catch (e: any) {
      set({ error: e.message });
      return false;
    }
  },

  logout: async () => {
    await clearTokens();
    set({ token: null, refreshToken: null });
  },
}));
