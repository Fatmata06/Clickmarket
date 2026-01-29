// lib/api/cart.ts
import { handleAuthError, getAuthToken } from "./auth-error-handler";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface CartItem {
  _id: string;
  produit: {
    _id: string;
    nomProduit: string;
    prix: number;
    images: Array<{ url: string; publicId: string }>;
    stock: number;
    typeProduit: string;
  };
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export interface Cart {
  _id: string;
  utilisateur?: string;
  sessionId?: string;
  articles: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  panier: Cart | null;
}

// Récupérer le panier
export async function getCart(): Promise<CartResponse> {
  const token = getAuthToken();
  const sessionId = localStorage.getItem("cartSessionId");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // N'envoyer sessionId QUE si pas de token (utilisateur non connecté)
  if (!token && sessionId) {
    headers["X-Session-ID"] = sessionId;
  }

  const response = await fetch(`${API_URL}/panier`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  // Gérer les erreurs 401
  if (response.status === 401) {
    handleAuthError(response);
  }

  // Stocker le sessionId retourné par le serveur dans le header
  const newSessionId = response.headers.get("X-Session-ID");
  if (newSessionId && !token) {
    localStorage.setItem("cartSessionId", newSessionId);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

// Ajouter un article au panier
export async function addToCart(
  produitId: string,
  quantite: number = 1,
): Promise<{ panier: Cart; message: string }> {
  const token = getAuthToken();
  const sessionId = localStorage.getItem("cartSessionId");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // N'envoyer sessionId QUE si pas de token (utilisateur non connecté)
  if (!token && sessionId) {
    headers["X-Session-ID"] = sessionId;
  }

  const response = await fetch(`${API_URL}/panier/article`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ produitId, quantite }),
  });

  // Gérer les erreurs 401
  if (response.status === 401) {
    handleAuthError(response);
  }

  // Stocker le sessionId retourné par le serveur dans le header
  const newSessionId = response.headers.get("X-Session-ID");
  if (newSessionId && !token) {
    localStorage.setItem("cartSessionId", newSessionId);
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Modifier la quantité d'un article
export async function updateCartItem(
  articleId: string,
  quantite: number,
): Promise<{ panier: Cart; message: string }> {
  const token = getAuthToken();
  const sessionId = localStorage.getItem("cartSessionId");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // N'envoyer sessionId QUE si pas de token (utilisateur non connecté)
  if (!token && sessionId) {
    headers["X-Session-ID"] = sessionId;
  }

  const response = await fetch(`${API_URL}/panier/article/${articleId}`, {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({ quantite }),
  });

  // Gérer les erreurs 401
  if (response.status === 401) {
    handleAuthError(response);
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Supprimer un article du panier
export async function removeFromCart(
  articleId: string,
): Promise<{ panier: Cart; message: string }> {
  const token = getAuthToken();
  const sessionId = localStorage.getItem("cartSessionId");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // N'envoyer sessionId QUE si pas de token (utilisateur non connecté)
  if (!token && sessionId) {
    headers["X-Session-ID"] = sessionId;
  }

  const response = await fetch(`${API_URL}/panier/article/${articleId}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  // Gérer les erreurs 401
  if (response.status === 401) {
    handleAuthError(response);
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Vider le panier
export async function clearCart(): Promise<{ message: string }> {
  const token = getAuthToken();
  const sessionId = localStorage.getItem("cartSessionId");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // N'envoyer sessionId QUE si pas de token (utilisateur non connecté)
  if (!token && sessionId) {
    headers["X-Session-ID"] = sessionId;
  }

  const response = await fetch(`${API_URL}/panier/vider`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  // Gérer les erreurs 401
  if (response.status === 401) {
    handleAuthError(response);
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Fusionner le panier invité avec le panier utilisateur après connexion
export async function mergeCartAfterLogin(
  sessionId: string,
): Promise<{ panier: Cart; message: string; sessionIdToDelete?: string }> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Token d'authentification requis pour fusionner le panier");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_URL}/panier/merge`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ sessionId }),
  });

  // Gérer les erreurs 401
  if (response.status === 401) {
    handleAuthError(response);
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}
