import { useState, useEffect, useCallback } from "react";
import { getProductById, Product } from "@/lib/api/products";
import { useAuth } from "@/context/auth-context";

interface UseProductReturn {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProduct(productId: string): UseProductReturn {
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setError("ID produit manquant");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getProductById(productId, token || undefined);

      if (response.success && response.product) {
        setProduct(response.product);
      } else {
        setError(
          response.message || "Erreur lors de la récupération du produit",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, [productId, token]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}
