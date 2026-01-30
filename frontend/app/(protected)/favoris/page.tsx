"use client";

import { useState, useEffect } from "react";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getFavoris, retirerFavori } from "@/lib/api/favoris";
import type { Produit } from "@/lib/api/produits";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

export default function FavorisPage() {
  const [favorites, setFavorites] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { hasRole } = useAuth();
  const isAdminOrFournisseur = hasRole(["admin", "fournisseur"]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavoris();
      setFavorites(data);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
      toast.error("Erreur lors du chargement des favoris");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (produitId: string) => {
    try {
      setRemovingId(produitId);
      await retirerFavori(produitId);
      setFavorites(favorites.filter((fav) => fav._id !== produitId));
      toast.success("Produit retiré des favoris");
    } catch (error) {
      console.error("Erreur lors du retrait:", error);
      toast.error("Erreur lors du retrait des favoris");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (produitId: string) => {
    try {
      setAddingToCart(produitId);
      await addToCart(produitId, 1);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="stack-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mes Favoris
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {favorites.length} produit{favorites.length !== 1 ? "s" : ""} dans
              vos favoris
            </p>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map((product) => {
                const imageUrl =
                  product.images &&
                  product.images.length > 0 &&
                  typeof product.images[0] === "object" &&
                  "url" in product.images[0]
                    ? (product.images[0] as { url: string; publicId: string })
                        .url
                    : "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400";

                const inStock = product.stock > 0;

                return (
                  <Card
                    key={product._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <Link href={`/produits/${product._id}`}>
                        <div className="relative h-48 w-full">
                          <Image
                            src={imageUrl}
                            alt={product.nomProduit}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                          {!inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge className="bg-destructive/90 text-destructive-foreground">
                                Rupture de stock
                              </Badge>
                            </div>
                          )}
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 surface-glass"
                        onClick={() => handleRemoveFavorite(product._id)}
                        disabled={removingId === product._id}
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      </Button>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-card/90 text-foreground">
                          {product.typeProduit === "fruits"
                            ? "Fruits"
                            : "Légumes"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <Link href={`/produits/${product._id}`}>
                          <h3 className="font-semibold line-clamp-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                            {product.nomProduit}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">
                            {product.rating || 4.5} ({product.reviewsCount || 0}{" "}
                            avis)
                          </span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {product.prix.toLocaleString()} FCFA
                      </div>
                      <div className="space-y-2">
                        {!isAdminOrFournisseur && (
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleAddToCart(product._id)}
                            disabled={!inStock || addingToCart === product._id}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {addingToCart === product._id
                              ? "Ajout..."
                              : "Ajouter au panier"}
                          </Button>
                        )}
                        <Link href={`/produits/${product._id}`}>
                          <Button variant="outline" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir les détails
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucun favori pour le moment
                </p>
                <p className="text-muted-foreground text-center mb-4">
                  Commencez à ajouter des produits à vos favoris en cliquant sur
                  le cœur
                </p>
                <Link href="/produits">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Découvrir les produits
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
