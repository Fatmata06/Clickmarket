import type { Produit } from "./produits";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Récupérer le token depuis localStorage
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  const authData = localStorage.getItem("clickmarket_auth");
  if (authData) {
    try {
      const { token } = JSON.parse(authData);
      return token;
    } catch (error) {
      console.error("Erreur lors de la lecture du token:", error);
      return null;
    }
  }
  return null;
};

// Gestion de l'erreur d'authentification
const handleAuthError = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("clickmarket_auth");
    window.location.href = "/login";
  }
};

// Récupérer tous les favoris de l'utilisateur
export async function getFavoris(): Promise<Produit[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/favoris`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return (result.favoris as Produit[]) || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    throw error;
  }
}

// Ajouter un produit aux favoris
export async function ajouterFavori(produitId: string): Promise<void> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Vous devez être connecté pour ajouter aux favoris");
    }

    const response = await fetch(`${API_URL}/favoris/${produitId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de l'ajout aux favoris",
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris:", error);
    throw error;
  }
}

// Retirer un produit des favoris
export async function retirerFavori(produitId: string): Promise<void> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/favoris/${produitId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Erreur lors du retrait des favoris:", error);
    throw error;
  }
}

// Vérifier si un produit est favori
export async function verifierFavori(produitId: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    const response = await fetch(`${API_URL}/favoris/check/${produitId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return false;
      }
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.isFavorite || false;
  } catch (error) {
    console.error("Erreur lors de la vérification du favori:", error);
    return false;
  }
}
