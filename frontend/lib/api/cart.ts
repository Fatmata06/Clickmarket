// lib/api/cart.ts
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
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/panier`, {
    method: "GET",
    headers,
    credentials: "include", // Important pour les cookies de session
  });

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
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/panier/article`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ produitId, quantite }),
  });

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
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/panier/article/${articleId}`, {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({ quantite }),
  });

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
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/panier/article/${articleId}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Vider le panier
export async function clearCart(): Promise<{ message: string }> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/panier/vider`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}
