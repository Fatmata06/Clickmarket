import { useState, useEffect } from "react";
import { getCategories } from "@/lib/api/products";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>(["fruits", "legumes"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getCategories();
        if (response.success && response.categories) {
          setCategories(response.categories);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMessage);
        // Keep default categories on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}
