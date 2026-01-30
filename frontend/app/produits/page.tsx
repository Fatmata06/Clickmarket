// app/produits/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductsGrid from "@/components/products/ProductGrid";
import ProductsFilters from "@/components/products/ProductsFilters";
import ProductsHeader from "@/components/products/ProducstHeader";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Plus, Package } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProducts } from "@/hooks/useProducts";

export default function ProduitsPage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [availability, setAvailability] = useState<string[]>([]);

  // Initialiser l'état fournisseur depuis localStorage
  const [isFournisseur] = useState(() => {
    try {
      const authData = localStorage.getItem("clickmarket_auth");
      if (authData) {
        const { user } = JSON.parse(authData);
        return user?.role === "fournisseur";
      }
      return false;
    } catch (error) {
      console.error(
        "Erreur lors de la lecture des données utilisateur:",
        error,
      );
      return false;
    }
  });

  const { total } = useProducts({
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 to-background dark:from-muted/40 dark:to-background">
      <div className="page-container-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <ProductsHeader />

          {/* Bouton Fournisseur */}
          {isFournisseur && (
            <div className="flex gap-2">
              <Button
                onClick={() => router.push("/fournisseur/produits")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Mes produits
              </Button>
              <Button
                onClick={() => router.push("/fournisseur/produits/nouveau")}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nouveau produit
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:w-1/4">
            <div className="sticky top-24">
              <div className="surface-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen((prev) => !prev)}
                    className="flex items-center gap-2 text-left"
                  >
                    <Filter className="h-5 w-5" />
                    <h2 className="text-xl font-bold text-foreground">
                      Filtres
                    </h2>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:underline cursor-pointer"
                    onClick={() => {
                      setPriceRange([0, 20000]);
                      setSelectedCategories([]);
                      setRating(null);
                      setAvailability([]);
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
                {filtersOpen && (
                  <div className="border-top-default pt-4">
                    <ProductsFilters
                      priceRange={priceRange}
                      onPriceRangeChange={setPriceRange}
                      categories={selectedCategories}
                      onCategoriesChange={setSelectedCategories}
                      rating={rating}
                      onRatingChange={setRating}
                      availability={availability}
                      onAvailabilityChange={setAvailability}
                    />
                  </div>
                )}
                {!filtersOpen && (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setFiltersOpen(true)}
                  >
                    Afficher les filtres
                  </Button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 lg:w-3/4">
            {/* View Controls */}
            <div className="surface-card rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {total || 0}
                  </span>{" "}
                  produits trouvés
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {/* Bouton Filtres Mobile */}
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="lg:hidden flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Filtres
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <Filter className="h-5 w-5" />
                          Filtres
                        </SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <ProductsFilters
                          priceRange={priceRange}
                          onPriceRangeChange={setPriceRange}
                          categories={selectedCategories}
                          onCategoriesChange={setSelectedCategories}
                          rating={rating}
                          onRatingChange={setRating}
                          availability={availability}
                          onAvailabilityChange={setAvailability}
                        />
                      </div>
                      <div className="mt-6">
                        <Button
                          onClick={() => setShowFilters(false)}
                          className="w-full btn-primary"
                        >
                          Appliquer les filtres
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Mode d'affichage */}
                  <div className="flex items-center border-default rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      className={`h-9 w-9 rounded-none ${
                        viewMode === "grid"
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : ""
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      className={`h-9 w-9 rounded-none ${
                        viewMode === "list"
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : ""
                      }`}
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Tri */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 input-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="popular">Les plus populaires</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="newest">Nouveautés</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <ProductsGrid
              viewMode={viewMode}
              filters={{
                priceRange,
                categories: selectedCategories,
                rating,
                availability,
              }}
            />

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <nav className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" disabled>
                  Précédent
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-primary/10 text-primary hover:bg-primary/15"
                >
                  1
                </Button>
                <Button variant="ghost" size="sm">
                  2
                </Button>
                <span className="px-2 text-muted-foreground">...</span>
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
