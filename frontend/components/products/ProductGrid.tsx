// components/products/ProductsGrid.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/cart-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProductsGrid() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { products, isLoading, error } = useProducts({
    limit: 12,
  });
  const { addToCart } = useCart();

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId);
      await addToCart(productId, 1);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    } finally {
      setAddingToCart(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Erreur: {error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
      {products.map((product) => {
        // Transformer les données du backend pour correspondre au rendu attendu
        const imageUrl =
          product.images &&
          product.images.length > 0 &&
          typeof product.images[0] === "object" &&
          "url" in product.images[0]
            ? (product.images[0] as { url: string; publicId: string }).url
            : "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400";

        const inStock = product.stock && product.stock > 0;
        const isActive = product.estActif !== false;

        return (
          <Card
            key={product._id}
            className="overflow-hidden border-0 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="relative">
              <div className="relative h-48">
                <Image
                  src={imageUrl}
                  alt={product.nomProduit}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      inStock
                        ? "bg-green-700 text-white dark:bg-green-900 dark:text-white"
                        : "bg-red-700 text-white dark:bg-red-900 dark:text-white"
                    }`}
                  >
                    {inStock ? "En stock" : "Rupture"}
                  </span>
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.typeProduit && (
                    <Badge className="bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200">
                      {product.typeProduit === "fruits" ? "Fruits" : "Légumes"}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => toggleFavorite(product._id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(product._id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
                {!inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold bg-red-600 px-4 py-1 rounded-full">
                      Rupture de stock
                    </span>
                  </div>
                )}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.typeProduit === "fruits" ? "Fruits" : "Légumes"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium dark:text-gray-300">
                    {product.rating || 4.5} ({product.reviewsCount || 0})
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-lg dark:text-white line-clamp-1">
                {product.nomProduit}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                {product.description || "Produit frais et de qualité"}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {product.prix.toLocaleString()} F
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2 p-4 pt-0">
              <Button
                className="flex-1 bg-green-600 text-white hover:bg-green-700 hover:text-white dark:bg-green-700 dark:hover:bg-green-600"
                disabled={!inStock || !isActive || addingToCart === product._id}
                onClick={() => handleAddToCart(product._id)}
              >
                <ShoppingCart className="h-4 w-4 mr-0" />
                {addingToCart === product._id
                  ? "Ajout..."
                  : "Ajouter au panier"}
              </Button>

              <Link
                href={`/produits/${product._id}`}
                className="h-full flex items-center justify-center px-3 rounded-md border border-gray-800 dark:border-gray-600
                 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
