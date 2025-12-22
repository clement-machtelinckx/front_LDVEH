// services/apiClient.ts
import { API_URL, BASE_URL } from '@/constants/api';
import { useAuth } from '@/store/useAuth';
import { getAccessToken, getRefreshToken } from '@/services/auth';

/**
 * Service API centralisé avec gestion automatique du refresh token
 * 
 * Ce service intercepte les requêtes et gère automatiquement :
 * - L'ajout du token d'authentification
 * - Le refresh automatique du token en cas d'expiration (401)
 * - La retry de la requête après refresh
 */
class ApiClient {
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  /**
   * Effectue une requête avec gestion automatique du token
   * @param endpoint - Endpoint relatif (sera préfixé par API_URL) ou URL complète
   * @param options - Options de la requête
   * @param useBaseUrl - Si true, utilise BASE_URL au lieu de API_URL
   */
  async request(
    endpoint: string,
    options: RequestInit = {},
    useBaseUrl: boolean = false
  ): Promise<Response> {
    const token = await getAccessToken();
    
    // Déterminer l'URL de base
    const baseUrl = useBaseUrl ? BASE_URL : API_URL;
    
    // Préparer les headers
    const headers: HeadersInit = {
      ...options.headers,
    };

    // Ajouter Content-Type seulement si on a un body (POST, PUT, PATCH)
    const hasBody = options.body !== undefined;
    if (hasBody && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Ajouter le token si disponible
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Effectuer la requête
    let response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Si le token est expiré (401) ou manquant, essayer de le rafraîchir
    if (response.status === 401) {
      // Vérifier si on a un refresh token disponible
      const refreshToken = await getRefreshToken();
      
      if (refreshToken) {
        const refreshed = await this.handleTokenRefresh();
        
        if (refreshed) {
          // Réessayer la requête avec le nouveau token
          const newToken = await getAccessToken();
          if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(`${baseUrl}${endpoint}`, {
              ...options,
              headers,
            });
          }
        }
      }
    }

    return response;
  }

  /**
   * Gère le refresh du token de manière thread-safe
   */
  private async handleTokenRefresh(): Promise<boolean> {
    // Si un refresh est déjà en cours, attendre qu'il se termine
    if (this.isRefreshing && this.refreshPromise) {
      return await this.refreshPromise;
    }

    // Démarrer un nouveau refresh
    this.isRefreshing = true;
    this.refreshPromise = useAuth.getState().refreshAccessToken();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Méthodes helper pour les différents types de requêtes
   */
  async get(endpoint: string, options?: RequestInit, useBaseUrl?: boolean): Promise<Response> {
    return this.request(endpoint, { ...options, method: 'GET' }, useBaseUrl);
  }

  async post(endpoint: string, body?: any, options?: RequestInit, useBaseUrl?: boolean): Promise<Response> {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }, useBaseUrl);
  }

  async put(endpoint: string, body?: any, options?: RequestInit, useBaseUrl?: boolean): Promise<Response> {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }, useBaseUrl);
  }

  async patch(endpoint: string, body?: any, options?: RequestInit, useBaseUrl?: boolean): Promise<Response> {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }, useBaseUrl);
  }

  async delete(endpoint: string, options?: RequestInit, useBaseUrl?: boolean): Promise<Response> {
    return this.request(endpoint, { ...options, method: 'DELETE' }, useBaseUrl);
  }
}

export const apiClient = new ApiClient();

