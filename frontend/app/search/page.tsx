"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Heart,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import Breadcrumb from "@/components/breadcrumb";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/cart-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([1000, 20000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const { addToCart } = useCart();

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const authData = localStorage.getItem("clickmarket_auth");
    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        setIsAdmin(user?.role === "admin");
      } catch (error) {
        console.error(
          "Erreur lors de la lecture des données utilisateur:",
          error,
        );
      }
    }
  }, []);

  // Fetch products based on search query
  const { products, isLoading, error } = useProducts({
    limit: 12,
    ...(searchQuery && { search: searchQuery }),
  });

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAddingToCart(productId);
      await addToCart(productId, 1);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    } finally {
      setAddingToCart(null);
    }
  };

  const breadcrumbs = [
    { label: "Accueil", href: "/" },
    { label: "Recherche", href: "/search" },
    { label: searchQuery || "Résultats", href: "#" },
  ];

  const sortOptions = [
    { value: "popular", label: "Les plus populaires" },
    { value: "newest", label: "Nouveautés" },
    { value: "price-asc", label: "Prix croissant" },
    { value: "price-desc", label: "Prix décroissant" },
    { value: "rating", label: "Meilleures notes" },
  ];

  const filters = {
    brands: ["Ferme Locale", "BioNature", "FruitExpress", "Maison"],
    categories: ["Fruits d'été", "Fruits exotiques", "Fruits de saison"],
  };

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        setHasSearched(true);
        // L'URL sera mise à jour par useEffect pour les produits
      }
    },
    [searchQuery],
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800">
        <div className="page-container">
          <Breadcrumb items={breadcrumbs} className="text-white/80 mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Rechercher</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-8">
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher des produits..."
                  className="pl-10 h-12 bg-white text-gray-900 border-white focus:ring-0 focus:border-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="h-12 bg-card text-green-600 hover:bg-muted font-semibold"
              >
                Rechercher
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasSearched ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Commencez votre recherche
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Entrez un terme de recherche pour trouver les produits que vous
              cherchez
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Erreur
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div
              className={`lg:w-1/4 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              <div className="surface-card rounded-lg p-6 stack-6">
                {/* Mobile Filters Header */}
                <div className="flex items-center justify-between lg:hidden">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filtres
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Fourchette de prix
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {priceRange[0].toLocaleString()} FCFA
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {priceRange[1].toLocaleString()} FCFA
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Brands */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Marques
                  </h4>
                  <div className="space-y-2">
                    {filters.brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(
                                selectedBrands.filter((b) => b !== brand),
                              );
                            }
                          }}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange([1000, 20000]);
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="surface-card rounded-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Results Count */}
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {products.length}
                    </span>{" "}
                    résultat{products.length !== 1 ? "s" : ""} trouvé
                    {products.length !== 1 ? "s" : ""}
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center gap-4">
                    {/* Mobile Filter Button */}
                    <Button
                      variant="outline"
                      className="lg:hidden"
                      onClick={() => setShowFilters(true)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtres
                    </Button>

                    {/* View Toggle */}
                    <div className="flex items-center border-default rounded-lg overflow-hidden">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="icon"
                        className="h-9 w-9 rounded-none"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="icon"
                        className="h-9 w-9 rounded-none"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Sort Selector */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 input-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {products.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      Aucun produit ne correspond à votre recherche
                    </p>
                  </div>
                ) : (
                  products.map((product) => {
                    const imageUrl =
                      product.images && product.images.length > 0
                        ? typeof product.images[0] === "string"
                          ? product.images[0]
                          : product.images[0].url
                        : "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136";

                    return (
                      <div
                        key={product._id}
                        className={`group relative surface-card-hover rounded-lg overflow-hidden ${
                          viewMode === "list" ? "flex" : "block"
                        }`}
                      >
                        <Link
                          href={`/produits/${product._id}`}
                          className={viewMode === "list" ? "w-3/4" : ""}
                        >
                          {/* Product Image */}
                          <div
                            className={`relative ${
                              viewMode === "list"
                                ? "w-full aspect-square"
                                : "w-full aspect-square"
                            }`}
                          >
                            <div className="relative w-full h-full bg-muted">
                              <Image
                                src={imageUrl}
                                alt={product.nomProduit}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes={
                                  viewMode === "list"
                                    ? "25vw"
                                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                }
                              />
                            </div>
                            {product.stock < 10 && product.stock > 0 && (
                              <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
                                Stock faible
                              </Badge>
                            )}
                            {product.stock === 0 && (
                              <Badge className="absolute top-2 left-2 bg-destructive/90 text-destructive-foreground">
                                Épuisé
                              </Badge>
                            )}
                          </div>

                          {/* Product Info */}
                          <div
                            className={`p-4 ${viewMode === "list" ? "" : ""}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                {product.fournisseur?.nomEntreprise && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs mb-2"
                                  >
                                    {product.fournisseur.nomEntreprise}
                                  </Badge>
                                )}
                                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                                  {product.nomProduit}
                                </h3>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center gap-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(product.rating || 4.5)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : i < (product.rating || 4.5)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300 dark:text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                ({product.reviewsCount || 0})
                              </span>
                            </div>

                            <div className="mt-4">
                              <div>
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                  {product.prix.toLocaleString()} FCFA
                                </span>
                              </div>
                            </div>

                            {product.stock > 0 && product.stock < 10 && (
                              <p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                                Plus que {product.stock} en stock
                              </p>
                            )}
                          </div>
                        </Link>

                        {/* Action Buttons */}
                        <div
                          className={`absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${viewMode === "list" ? "w-1/4 h-full flex items-start justify-center p-2" : "m-2"}`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="surface-glass"
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Add to Cart Button - Outside Link */}
                        {!isAdmin ? (
                          <div
                            className={`absolute bottom-2 right-2 z-10 ${viewMode === "list" ? "bottom-auto top-12 right-2" : ""}`}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1 surface-glass opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={
                                product.stock === 0 ||
                                addingToCart === product._id
                              }
                              onClick={(e) => handleAddToCart(e, product._id)}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              {addingToCart === product._id ? "..." : "Ajouter"}
                            </Button>
                          </div>
                        ) : (
                          <div
                            className={`absolute bottom-2 right-2 z-10 flex gap-1 ${viewMode === "list" ? "bottom-auto top-12 right-2" : ""}`}
                          >
                            <Button
                              size="sm"
                              className="gap-1 bg-blue-600/90 hover:bg-blue-700 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(
                                  `/produits/modifier/${product._id}`,
                                );
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-1 bg-destructive/90 hover:bg-destructive backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity px-2"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
