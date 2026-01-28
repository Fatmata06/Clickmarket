"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Heart,
} from "lucide-react";
import Breadcrumb from "@/components/breadcrumb";
import { useProducts } from "@/hooks/useProducts";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.slug;

  // Map slug to typeProduit
  const categoryType =
    categorySlug === "fruits"
      ? "fruits"
      : categorySlug === "legumes"
        ? "legumes"
        : categorySlug;

  const { products, isLoading, error, total } = useProducts({
    typeProduit: categoryType,
    limit: 12,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([1000, 20000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const category = {
    slug: categorySlug,
    name:
      categorySlug === "fruits"
        ? "Fruits Frais"
        : categorySlug === "legumes"
          ? "Légumes"
          : categorySlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
    description:
      categorySlug === "fruits"
        ? "Découvrez notre sélection de fruits frais, locaux et de saison."
        : categorySlug === "legumes"
          ? "Des légumes frais et biologiques pour vos plats quotidiens."
          : "Découvrez notre sélection de produits de qualité.",
    totalProducts: total || 0,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
  };

  const breadcrumbs = [
    { label: "Accueil", href: "/" },
    { label: "Catégories", href: "/categories" },
    { label: category.name, href: `#` },
  ];

  const sortOptions = [
    { value: "popular", label: "Les plus populaires" },
    { value: "newest", label: "Nouveautés" },
    { value: "price-asc", label: "Prix croissant" },
    { value: "price-desc", label: "Prix décroissant" },
    { value: "rating", label: "Meilleures notes" },
  ];

  // Dummy data for filters (to be connected to backend later)
  const filters = {
    brands: ["Ferme Locale", "BioNature", "FruitExpress", "Maison"],
    categories: [
      "Fruits d'été",
      "Fruits exotiques",
      "Fruits de saison",
      "Fruits secs",
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erreur
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Category Hero */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white lg:w-2/3">
              <Breadcrumb items={breadcrumbs} className="text-white/80" />
              <h1 className="text-4xl font-bold mt-4">{category.name}</h1>
              <p className="mt-2 text-lg opacity-90">{category.description}</p>
              <div className="mt-4 flex items-center gap-4">
                <Badge className="bg-white/20 text-white">
                  {category.totalProducts} produits
                </Badge>
                <span className="text-white/80">
                  Livraison gratuite sur tous les produits
                </span>
              </div>
            </div>
            <div className="relative w-full lg:w-1/3 aspect-video lg:aspect-square rounded-lg overflow-hidden shadow-2xl">
              <div className="relative w-full h-full bg-gray-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
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

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Sous-catégories
                </h4>
                <div className="space-y-1">
                  {filters.categories.map((subCategory) => (
                    <Link
                      key={subCategory}
                      href={`/categories/${category.slug}/${subCategory.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block py-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      {subCategory}
                    </Link>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Results Count */}
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {products.length}
                  </span>{" "}
                  produits trouvés
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
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
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
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    Aucun produit trouvé dans cette catégorie
                  </p>
                </div>
              ) : (
                products.map((product) => {
                  const imageUrl =
                    product.images && product.images.length > 0
                      ? (product.images[0] as { url: string; publicId: string })
                          .url
                      : "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136";

                  return (
                    <Link
                      key={product._id}
                      href={`/produits/${product._id}`}
                      className={`group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden ${
                        viewMode === "list" ? "flex" : "block"
                      }`}
                    >
                      {/* Product Image */}
                      <div
                        className={`relative ${
                          viewMode === "list"
                            ? "w-1/4 aspect-square"
                            : "w-full aspect-square"
                        }`}
                      >
                        <div className="relative w-full h-full bg-gray-100 dark:bg-gray-700">
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
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                            Épuisé
                          </Badge>
                        )}
                        {product.tags && product.tags.includes("Nouveau") && (
                          <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                            Nouveau
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-2 right-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            // Add to favorites
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Product Info */}
                      <div
                        className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            {product.fournisseur?.nomEntreprise && (
                              <Badge variant="outline" className="text-xs mb-2">
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

                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                              {product.prix.toLocaleString()} FCFA
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1"
                            onClick={(e) => {
                              e.preventDefault();
                              // Add to cart
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Ajouter
                          </Button>
                        </div>

                        {product.stock > 0 && product.stock < 10 && (
                          <p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                            Plus que {product.stock} en stock
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="default" size="sm" className="h-9 w-9">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-9 w-9">
                  2
                </Button>
                <Button variant="outline" size="sm" className="h-9 w-9">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
