import { handleAuthError, getAuthToken } from "./auth-error-handler";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface UniteVente {
  nom: string;
  pas: number;
}

export interface ImageProduit {
  _id?: string;
  url: string;
  publicId: string;
}

export interface Produit {
  _id: string;
  nomProduit: string;
  typeProduit: "fruits" | "legumes";
  description: string;
  prix: number;
  stock: number;
  uniteVente?: UniteVente;
  images: ImageProduit[];
  fournisseur: {
    _id: string;
    nomEntreprise?: string;
    nom?: string;
    prenom?: string;
  };
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  statutValidation?: "en_attente" | "accepte" | "refuse";
  raisonRefus?: string;
  dateValidation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetProduitsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
  sort?: "price-asc" | "price-desc" | "newest" | "popular" | "rating";
  includeNonValides?: boolean;
}

export interface ProduitsResponse {
  success: boolean;
  products: Produit[];
  total: number;
  page: number;
  pages: number;
  message?: string;
}

export interface CreateProduitData {
  nomProduit: string;
  typeProduit: "fruits" | "legumes";
  description: string;
  prix: number;
  stock: number;
  uniteVente?: string; // JSON stringifié
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  images: File[];
}

export interface UpdateProduitData {
  nomProduit?: string;
  typeProduit?: "fruits" | "legumes";
  description?: string;
  prix?: number;
  stock?: number;
  uniteVente?: string; // JSON stringifié
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  images?: File[];
  imagesToDelete?: string[];
}

// Récupérer tous les produits avec filtres
export async function getProduits(
  params?: GetProduitsParams,
): Promise<ProduitsResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.minPrice !== undefined)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice !== undefined)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params?.inStock !== undefined)
      queryParams.append("inStock", params.inStock.toString());
    if (params?.tags)
      params.tags.forEach((tag) => queryParams.append("tags", tag));
    if (params?.sort) queryParams.append("sort", params.sort);
    if (params?.includeNonValides)
      queryParams.append("includeNonValides", "true");

    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/produits?${queryParams}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw error;
  }
}

// Récupérer un produit par ID
export async function getProduitById(id: string): Promise<Produit> {
  try {
    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/produits/${id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.product || result.produit || result;
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    throw error;
  }
}

// Récupérer les catégories
export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/produits/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.categories || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    throw error;
  }
}

// Créer un nouveau produit (Fournisseur uniquement)
export async function createProduit(data: CreateProduitData): Promise<Produit> {
  try {
    const formData = new FormData();

    formData.append("nomProduit", data.nomProduit);
    formData.append("typeProduit", data.typeProduit);
    formData.append("description", data.description);
    formData.append("prix", data.prix.toString());
    formData.append("stock", data.stock.toString());

    if (data.uniteVente) {
      formData.append("uniteVente", data.uniteVente);
    }

    if (data.rating !== undefined) {
      formData.append("rating", data.rating.toString());
    }

    if (data.reviewsCount !== undefined) {
      formData.append("reviewsCount", data.reviewsCount.toString());
    }

    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag) => formData.append("tags", tag));
    }

    // Ajouter les images
    data.images.forEach((image) => {
      formData.append("images", image);
    });

    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/produits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    const result = await response.json();
    return result.produit || result;
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    throw error;
  }
}

// Mettre à jour un produit
export async function updateProduit(
  id: string,
  data: UpdateProduitData,
): Promise<Produit> {
  try {
    const formData = new FormData();

    if (data.nomProduit) formData.append("nomProduit", data.nomProduit);
    if (data.typeProduit) formData.append("typeProduit", data.typeProduit);
    if (data.description) formData.append("description", data.description);
    if (data.prix !== undefined) formData.append("prix", data.prix.toString());
    if (data.stock !== undefined)
      formData.append("stock", data.stock.toString());
    if (data.uniteVente) formData.append("uniteVente", data.uniteVente);
    if (data.rating !== undefined)
      formData.append("rating", data.rating.toString());
    if (data.reviewsCount !== undefined)
      formData.append("reviewsCount", data.reviewsCount.toString());

    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag) => formData.append("tags", tag));
    }

    // Ajouter les nouvelles images si fournies
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/produits/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    const result = await response.json();
    return result.produit || result;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    throw error;
  }
}

// Supprimer un produit
export async function deleteProduit(id: string): Promise<void> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/produits/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    throw error;
  }
}

// Supprimer une image spécifique d'un produit
export async function deleteImageProduit(
  produitId: string,
  imageId: string,
): Promise<Produit> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(
      `${API_URL}/produits/${produitId}/images/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    const result = await response.json();
    return result.produit || result;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    throw error;
  }
}

// Accepter un produit (Admin uniquement)
export async function accepterProduit(id: string): Promise<Produit> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/produits/${id}/accepter`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    const result = await response.json();
    return result.produit || result;
  } catch (error) {
    console.error("Erreur lors de l'acceptation du produit:", error);
    throw error;
  }
}

// Refuser un produit (Admin uniquement)
export async function refuserProduit(
  id: string,
  raisonRefus: string,
): Promise<Produit> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/produits/${id}/refuser`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raisonRefus }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
      }
      const error = await response.json();
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    const result = await response.json();
    return result.produit || result;
  } catch (error) {
    console.error("Erreur lors du refus du produit:", error);
    throw error;
  }
}
