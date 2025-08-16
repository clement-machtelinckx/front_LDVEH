// store/useAuth.ts
import { create } from 'zustand';
import { API_URL } from '@/constants/api';
import { saveToken, getToken, clearToken } from '@/services/auth';

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

type Jsonish = Record<string, any> | null;

async function parseJsonSafe(res: Response): Promise<Jsonish> {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text ? { error: text } : null;
  }
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  isLoading: false,
  error: null,
  authReady: false,

  init: async () => {
    const storedToken = await getToken();
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
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await parseJsonSafe(res)) as { token?: string; error?: string } | null;

      if (!res.ok) {
        const msg = (data && (data.error as string)) || `Erreur de connexion (${res.status})`;
        throw new Error(msg);
      }

      if (!data || !data.token) {
        throw new Error('Réponse invalide du serveur (token manquant)');
      }

      await saveToken(data.token);
      set({ token: data.token });
      return true;
    } catch (e: any) {
      set({ error: e?.message ?? 'Erreur de connexion inconnue' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await parseJsonSafe(res)) as { error?: string } | null;

      if (!res.ok) {
        const msg = (data && (data.error as string)) || `Erreur d'inscription (${res.status})`;
        throw new Error(msg);
      }

      // si ton API renvoie aussi un token à l'inscription, tu peux le sauvegarder ici.
      // ex: if ((data as any)?.token) { await saveToken((data as any).token); set({ token: (data as any).token }); }

      return true;
    } catch (e: any) {
      set({ error: e?.message ?? 'Erreur d’inscription inconnue' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await clearToken();
    set({ token: null });
  },
}));
