// components/products/ProductsGrid.tsx
"use client";

import { useState, useEffect, type MouseEvent } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Eye, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/cart-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  ajouterFavori,
  retirerFavori,
  verifierFavori,
} from "@/lib/api/favoris";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

interface ProductFilters {
  priceRange: number[];
  categories: string[];
  rating: number | null;
  availability: string[];
}

interface ProductsGridProps {
  viewMode?: "grid" | "list";
  filters?: ProductFilters;
}

export default function ProductsGrid({
  viewMode = "grid",
  filters,
}: ProductsGridProps) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [togglingFavorite, setTogglingFavorite] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFournisseur, setIsFournisseur] = useState(false);
  const { products, isLoading, error } = useProducts({
    limit: 12,
  });
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Vérifier le rôle de l'utilisateur et récupérer son ID
  useEffect(() => {
    const authData = localStorage.getItem("clickmarket_auth");
    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        setIsAdmin(user?.role === "admin");
        setIsFournisseur(user?.role === "fournisseur");
      } catch (error) {
        console.error(
          "Erreur lors de la lecture des données utilisateur:",
          error,
        );
      }
    }
  }, []);

  // Charger les favoris au montage
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated || !products) return;

      try {
        const favoriteStatuses = await Promise.all(
          products.map(async (product) => {
            const isFav = await verifierFavori(product._id);
            return { id: product._id, isFav };
          }),
        );

        const favIds = favoriteStatuses.filter((f) => f.isFav).map((f) => f.id);
        setFavorites(favIds);
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
      }
    };

    loadFavorites();
  }, [products, isAuthenticated]);

  const toggleFavorite = async (productId: string, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter aux favoris");
      return;
    }

    try {
      setTogglingFavorite(productId);
      const isFavorite = favorites.includes(productId);

      if (isFavorite) {
        await retirerFavori(productId);
        setFavorites(favorites.filter((id) => id !== productId));
        toast.success("Produit retiré des favoris");
      } else {
        await ajouterFavori(productId);
        setFavorites([...favorites, productId]);
        toast.success("Produit ajouté aux favoris");
      }
    } catch (error) {
      console.error("Erreur lors du toggle favori:", error);
      toast.error(
        (error as Error).message || "Erreur lors de la mise à jour des favoris",
      );
    } finally {
      setTogglingFavorite(null);
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
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-sm text-muted-foreground animate-pulse">
            Chargement des produits depuis le serveur...
          </p>
          <p className="text-xs text-muted-foreground/60">
            Première connexion au serveur, veuillez patienter
          </p>
        </div>
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
        <p className="text-muted-foreground">Aucun produit trouvé</p>
      </div>
    );
  }

  const activeCategories = filters?.categories || [];
  const activeAvailability = filters?.availability || [];
  const minPrice = filters?.priceRange?.[0];
  const maxPrice = filters?.priceRange?.[1];

  const filteredProducts = products.filter((product) => {
    if (typeof minPrice === "number" && product.prix < minPrice) return false;
    if (typeof maxPrice === "number" && product.prix > maxPrice) return false;

    if (filters?.rating && (product.rating || 0) < filters.rating) return false;

    const categoryFilters = activeCategories.filter((c) =>
      ["fruits", "legumes"].includes(c),
    );
    if (categoryFilters.length > 0 && product.typeProduit) {
      if (!categoryFilters.includes(product.typeProduit)) return false;
    }

    if (activeAvailability.includes("in-stock") && product.stock <= 0) {
      return false;
    }

    return true;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun produit trouvé</p>
      </div>
    );
  }

  // Mode liste
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {filteredProducts.map((product) => {
          const imageUrl =
            product.images &&
            product.images.length > 0 &&
            typeof product.images[0] === "object" &&
            "url" in product.images[0]
              ? (product.images[0] as { url: string; publicId: string }).url
              : "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400";

          const inStock = product.stock && product.stock > 0;
          const isActive = product.estActif !== false;
          const isFavorite = favorites.includes(product._id);

          return (
            <Card
              key={product._id}
              className="overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="flex">
                {/* Image */}
                <Link
                  href={`/produits/${product._id}`}
                  className="relative w-48 shrink-0"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={product.nomProduit}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    {!inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Rupture</Badge>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Contenu */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {product.typeProduit && (
                            <Badge variant="outline" className="text-xs">
                              {product.typeProduit === "fruits"
                                ? "Fruits"
                                : "Légumes"}
                            </Badge>
                          )}
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              inStock
                                ? "bg-primary/10 text-primary"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {inStock ? "En stock" : "Rupture"}
                          </span>
                        </div>
                        <Link href={`/produits/${product._id}`}>
                          <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
                            {product.nomProduit}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {product.description || "Produit frais et de qualité"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => toggleFavorite(product._id, e)}
                        disabled={togglingFavorite === product._id}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorite
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {product.rating || 4.5} ({product.reviewsCount || 0}{" "}
                        avis)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-primary">
                      {product.prix.toLocaleString()} F
                    </span>
                    {isAdmin ? (
                      // Boutons pour admin
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/30 text-primary hover:bg-primary/10"
                          onClick={() =>
                            router.push(`/produits/modifier/${product._id}`)
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="btn-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Refuser
                        </Button>
                      </div>
                    ) : isFournisseur ? (
                      // Boutons pour fournisseur
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/30 text-primary hover:bg-primary/10"
                          onClick={() =>
                            router.push(`/produits/modifier/${product._id}`)
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="btn-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    ) : (
                      // Boutons pour clients
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="btn-primary text-white"
                          disabled={
                            !inStock ||
                            !isActive ||
                            addingToCart === product._id
                          }
                          onClick={() => handleAddToCart(product._id)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {addingToCart === product._id
                            ? "Ajout..."
                            : "Ajouter"}
                        </Button>
                        <Link href={`/produits/${product._id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  // Mode grille (par défaut)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
      {filteredProducts.map((product) => {
        const imageUrl =
          product.images &&
          product.images.length > 0 &&
          typeof product.images[0] === "object" &&
          "url" in product.images[0]
            ? (product.images[0] as { url: string; publicId: string }).url
            : "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400";

        const inStock = product.stock && product.stock > 0;
        const isActive = product.estActif !== false;
        const isFavorite = favorites.includes(product._id);

        return (
          <Card
            key={product._id}
            className="overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div className="relative">
              <Link href={`/produits/${product._id}`}>
                <div className="relative h-48">
                  <Image
                    src={imageUrl}
                    alt={product.nomProduit}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/60 to-transparent">
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        inStock
                          ? "bg-primary text-white"
                          : "bg-destructive text-destructive-foreground"
                      }`}
                    >
                      {inStock ? "En stock" : "Rupture"}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.typeProduit && (
                      <Badge className="bg-card/90 text-foreground">
                        {product.typeProduit === "fruits"
                          ? "Fruits"
                          : "Légumes"}
                      </Badge>
                    )}
                  </div>
                  {!inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-destructive-foreground font-bold bg-destructive px-4 py-1 rounded-full">
                        Rupture de stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>
              <button
                onClick={(e) => toggleFavorite(product._id, e)}
                disabled={togglingFavorite === product._id}
                className="absolute top-3 right-3 p-2 rounded-full surface-glass hover:scale-110 transition-transform"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            </div>

            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {product.typeProduit === "fruits" ? "Fruits" : "Légumes"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {product.rating || 4.5} ({product.reviewsCount || 0})
                  </span>
                </div>
              </div>

              <Link href={`/produits/${product._id}`}>
                <h3 className="font-semibold text-lg text-foreground line-clamp-1 hover:text-primary transition-colors">
                  {product.nomProduit}
                </h3>
              </Link>

              <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                {product.description || "Produit frais et de qualité"}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {product.prix.toLocaleString()} F
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2 p-4 pt-0">
              {isAdmin ? (
                // Boutons pour admin
                <>
                  <Button
                    className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                    variant="outline"
                    onClick={() =>
                      router.push(`/produits/modifier/${product._id}`)
                    }
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button variant="destructive" className="px-4">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : isFournisseur ? (
                // Boutons pour fournisseur
                <>
                  <Button
                    className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                    variant="outline"
                    onClick={() =>
                      router.push(`/produits/modifier/${product._id}`)
                    }
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    className="btn-destructive px-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                // Boutons pour clients
                <>
                  <Button
                    className="flex-1 text-white"
                    disabled={
                      !inStock || !isActive || addingToCart === product._id
                    }
                    onClick={() => handleAddToCart(product._id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-0" />
                    {addingToCart === product._id
                      ? "Ajout..."
                      : "Ajouter au panier"}
                  </Button>

                  <Link
                    href={`/produits/${product._id}`}
                    className="h-full flex items-center justify-center px-3 rounded-md border border-border
                     text-foreground hover:bg-muted transition"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
