import { useState, useEffect, useCallback } from "react";
import { getAllProducts, Product } from "@/lib/api/products";
import { useAuth } from "@/context/auth-context";

interface UseProductsOptions {
  categorie?: string;
  typeProduit?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
  search?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    if (options.enabled === false) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getAllProducts(
        {
          categorie: options.categorie,
          typeProduit: options.typeProduit,
          page: options.page,
          limit: options.limit,
          search: options.search,
        },
        token || undefined,
      );

      if (response.success) {
        setProducts(response.products || []);
        setTotal(response.total || 0);
      } else {
        setError(response.message || "Erreur lors du chargement des produits");
        setProducts([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    options.categorie,
    options.typeProduit,
    options.page,
    options.limit,
    options.enabled,
    options.search,
    token,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    total,
    refetch: fetchProducts,
  };
}
