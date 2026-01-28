// app/produits/page.tsx
"use client";

import { useState } from "react";
import ProductsGrid from "@/components/products/ProductGrid";
import ProductsFilters from "@/components/products/ProductsFilters";
import ProductsHeader from "@/components/products/ProducstHeader";
import { Button } from "@/components/ui/button";
import { Filter, Grid } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/useProducts";

export default function ProduitsPage() {
  const [sortBy, setSortBy] = useState("popular");
  const { total } = useProducts({
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <ProductsHeader />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 dark:text-green-400 hover:underline cursor-pointer"
                >
                  Réinitialiser
                </Button>
              </div>
              <ProductsFilters />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">
                  {total || 0}
                </span>{" "}
                produits trouvés
              </div>

              <div className="flex items-center gap-4">
                <Tabs defaultValue="grid" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="grid">
                      <Grid className="h-4 w-4" />
                    </TabsTrigger>
                    {/* <TabsTrigger value="list">
                      <List className="h-4 w-4" />
                    </TabsTrigger> */}
                  </TabsList>
                </Tabs>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800 p-2 text-sm border-0 focus:ring-0 text-gray-700 dark:text-gray-300"
                >
                  <option value="popular">Les plus populaires</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <ProductsGrid />

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <nav className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" disabled>
                  Précédent
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                >
                  1
                </Button>
                <Button variant="ghost" size="sm">
                  2
                </Button>
                {/* <Button variant="ghost" size="sm">
                  3
                </Button> */}
                <span className="px-2 text-gray-500">...</span>
                <Button variant="ghost" size="sm">
                  10
                </Button>
                <Button variant="outline" size="sm">
                  Suivant
                </Button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
