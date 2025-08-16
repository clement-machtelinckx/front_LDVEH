// services/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = 'auth.token';

export async function saveToken(token: string) {
  // on encapsule pour un seul point d'écriture
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  // un seul point de lecture
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearToken() {
  // un seul point de suppression
  await AsyncStorage.removeItem(TOKEN_KEY);
}
