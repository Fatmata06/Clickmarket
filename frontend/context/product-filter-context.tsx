import { createContext, useContext, useState, useCallback } from "react";

interface ProductFilters {
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
  page: number;
  sortBy: "popular" | "price-asc" | "price-desc" | "newest";
}

interface ProductFilterContextType {
  filters: ProductFilters;
  setCategories: (categories: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setInStock: (inStock: boolean) => void;
  setPage: (page: number) => void;
  setSortBy: (sortBy: ProductFilters["sortBy"]) => void;
  resetFilters: () => void;
}

const defaultFilters: ProductFilters = {
  categories: [],
  priceRange: [0, 20000],
  inStock: false,
  page: 1,
  sortBy: "popular",
};

const ProductFilterContext = createContext<
  ProductFilterContextType | undefined
>(undefined);

export function ProductFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);

  const setCategories = useCallback((categories: string[]) => {
    setFilters((prev) => ({ ...prev, categories, page: 1 }));
  }, []);

  const setPriceRange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range, page: 1 }));
  }, []);

  const setInStock = useCallback((inStock: boolean) => {
    setFilters((prev) => ({ ...prev, inStock, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setSortBy = useCallback((sortBy: ProductFilters["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const value: ProductFilterContextType = {
    filters,
    setCategories,
    setPriceRange,
    setInStock,
    setPage,
    setSortBy,
    resetFilters,
  };

  return (
    <ProductFilterContext.Provider value={value}>
      {children}
    </ProductFilterContext.Provider>
  );
}

export function useProductFilters() {
  const context = useContext(ProductFilterContext);
  if (!context) {
    throw new Error(
      "useProductFilters must be used within ProductFilterProvider",
    );
  }
  return context;
}
