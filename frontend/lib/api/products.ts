import { handleAuthError } from "./auth-error-handler";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Product {
  _id: string;
  nomProduit: string;
  description?: string;
  prix: number;
  stock: number;
  uniteVente?: {
    nom: "kg" | "litre" | "piece";
    pas: number;
  };
  categorie?: string;
  typeProduit?: "fruits" | "legumes" | string;
  image?: string;
  images?: Array<{ url: string; publicId: string }>;
  estActif?: boolean;
  fournisseur?: {
    _id: string;
    nomEntreprise?: string;
  };
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  total?: number;
  page?: number;
  pages?: number;
  message?: string;
}

export interface ProductResponse {
  success: boolean;
  product: Product;
  message?: string;
}

/**
 * Récupère tous les produits avec filtres optionnels
 */
export async function getAllProducts(
  filters?: {
    categorie?: string;
    typeProduit?: string;
    page?: number;
    limit?: number;
    search?: string;
  },
  token?: string,
): Promise<ProductsResponse> {
  try {
    const params = new URLSearchParams();

    if (filters?.categorie) {
      params.append("categorie", filters.categorie);
    }
    if (filters?.typeProduit) {
      params.append("typeProduit", filters.typeProduit);
    }
    if (filters?.page) {
      params.append("page", String(filters.page));
    }
    if (filters?.limit) {
      params.append("limit", String(filters.limit));
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_URL}/produits${params.toString() ? "?" + params.toString() : ""}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError(response);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Récupère un produit par ID
 */
export async function getProductById(
  id: string,
  token?: string,
): Promise<ProductResponse> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/produits/${id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError(response);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

/**
 * Crée un nouveau produit (nécessite authentification admin/fournisseur)
 */
export async function createProduct(
  productData: Omit<Product, "_id">,
  token: string,
): Promise<ProductResponse> {
  try {
    const response = await fetch(`${API_URL}/produits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError(response);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

/**
 * Met à jour un produit existant
 */
export async function updateProduct(
  id: string,
  productData: Partial<Product>,
  token: string,
): Promise<ProductResponse> {
  try {
    const response = await fetch(`${API_URL}/produits/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError(response);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

/**
 * Supprime un produit (soft delete)
 */
export async function deleteProduct(
  id: string,
  token: string,
): Promise<ProductResponse> {
  try {
    const response = await fetch(`${API_URL}/produits/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError(response);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}
/**
 * Récupère les catégories de produits existantes depuis la base de données
 */
export async function getCategories(): Promise<{
  success: boolean;
  categories: string[];
  message?: string;
}> {
  try {
    const response = await fetch(`${API_URL}/produits/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError(response);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Retourner un tableau par défaut
    return {
      success: false,
      categories: ["fruits", "legumes"],
      message: "Catégories par défaut",
    };
  }
}
