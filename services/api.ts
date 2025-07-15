// services/api.ts

// a check si ce fichier sert a un truc si non sa dégage
export const API_BASE_URL = 'http://10.0.2.2:3000'; // 🔁 change si tu testes sur un vrai tel

export async function fetchBooks() {
  const res = await fetch(`${API_BASE_URL}/books`);
  if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);
  return await res.json();
}
