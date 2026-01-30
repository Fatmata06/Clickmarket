"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/cart-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

export default function FeaturedProducts() {
  const { products, isLoading, error } = useProducts({
    limit: 4,
  });
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

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
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-sm text-muted-foreground animate-pulse">
            Chargement des produits depuis le serveur...
          </p>
          <p className="text-xs text-muted-foreground/60">
            Cela peut prendre quelques instants lors du premier chargement
          </p>
        </div>
      </div>
    );
  }

  if (error || !products || products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => {
        const imageUrl =
          product.images &&
          product.images.length > 0 &&
          typeof product.images[0] === "object" &&
          "url" in product.images[0]
            ? (product.images[0] as { url: string; publicId: string }).url
            : "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400";

        const inStock = product.stock && product.stock > 0;

        return (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <Card className="overflow-hidden shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900 transition-all duration-300">
              <CardHeader className="p-0 relative overflow-hidden m-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={imageUrl}
                    alt={product.nomProduit}
                    fill
                    className="object-cover block"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <Badge className="absolute top-3 left-3 bg-green-800  text-white">
                    {product.typeProduit === "fruits" ? "Fruits" : "Légumes"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.typeProduit === "fruits" ? "Fruits" : "Légumes"}
                    </p>
                    <h3 className="font-semibold text-lg dark:text-white">
                      {product.nomProduit}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium dark:text-gray-300">
                      {product.rating || 4.5}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {product.prix.toLocaleString()} FCFA
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 p-4 pt-0">
                <Button
                  className="flex-1 bg-green-600 text-white hover:bg-green-700 hover:text-white dark:bg-green-700 dark:hover:bg-green-600"
                  disabled={!inStock || addingToCart === product._id}
                  onClick={() => handleAddToCart(product._id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {addingToCart === product._id ? "Ajout..." : "Ajouter"}
                </Button>
                <Link
                  href={`/produits/${product._id}`}
                  className="h-full flex items-center justify-center px-3 rounded-md border border-border text-foreground hover:bg-muted transition"
                >
                  Voir
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
