"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  ChevronLeft,
  Edit,
  Trash2,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { Breadcrumb } from "@/components/ui/breadcrumb";
import Breadcrumb from "@/components/breadcrumb";
import { useProduct } from "@/hooks/useProduct";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useProducts } from "@/hooks/useProducts";
import { deleteProduit } from "@/lib/api/produits";
import ProductNotFound from "@/components/products/ProductNotFound";
import {
  ajouterFavori,
  retirerFavori,
  verifierFavori,
} from "@/lib/api/favoris";
import { toast } from "sonner";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { product, isLoading, error } = useProduct(resolvedParams.id);
  const { products: relatedProducts } = useProducts({ limit: 3 });
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  console.log("ProductDetailPage - product:", product);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFournisseur, setIsFournisseur] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const stockValue = product?.stock ?? 0;
  const baseUnitLabel =
    product?.uniteVente?.nom === "piece"
      ? "pièce"
      : product?.uniteVente?.nom || "unité";
  const stockUnitLabel =
    baseUnitLabel === "unité"
      ? stockValue > 1
        ? "unités"
        : "unité"
      : baseUnitLabel === "pièce"
        ? stockValue > 1
          ? "pièces"
          : "pièce"
        : baseUnitLabel;
  const unitStep = product?.uniteVente?.pas ?? 1;

  // Vérifier le rôle de l'utilisateur et son propriété
  useEffect(() => {
    const authData = localStorage.getItem("clickmarket_auth");
    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        const isAdm = user?.role === "admin";
        const isFourn = user?.role === "fournisseur";
        setIsAdmin(isAdm);
        setIsFournisseur(isFourn);

        // Vérifier si l'utilisateur est propriétaire du produit
        if (product && isFourn && product.fournisseur?._id === user?.id) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la lecture des données utilisateur:",
          error,
        );
      }
    }
  }, [product]);

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!product || !isAuthenticated) {
        setIsFavorite(false);
        return;
      }

      try {
        const isFav = await verifierFavori(product._id);
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Erreur lors de la vérification du favori:", error);
      }
    };

    loadFavoriteStatus();
  }, [product, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter aux favoris");
      return;
    }

    try {
      setIsTogglingFavorite(true);
      if (isFavorite) {
        await retirerFavori(product._id);
        setIsFavorite(false);
        toast.success("Produit retiré des favoris");
      } else {
        await ajouterFavori(product._id);
        setIsFavorite(true);
        toast.success("Produit ajouté aux favoris");
      }
    } catch (error) {
      console.error("Erreur lors du toggle favori:", error);
      toast.error(
        (error as Error).message || "Erreur lors de la mise à jour des favoris",
      );
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    try {
      setIsDeleting(true);
      await deleteProduit(product._id);
      toast.success("Produit supprimé avec succès");
      router.push("/produits/gestion");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(
        (error as Error).message || "Erreur lors de la suppression du produit",
      );
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-sm text-muted-foreground animate-pulse">
            Chargement du produit...
          </p>
          <p className="text-xs text-muted-foreground/60">
            Veuillez patienter pendant la connexion au serveur
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <ProductNotFound
        id={resolvedParams.id}
        reason={error ? "not_found" : "not_found"}
      />
    );
  }

  const breadcrumbs = [
    { label: "Accueil", href: "/" },
    { label: "Produits", href: "/produits" },
    {
      label: product.typeProduit || "Catégorie",
      href: `/categories/${product.typeProduit || ""}`,
    },
    { label: product.nomProduit, href: `#` },
  ];

  // Préparer les images
  const productImages = product.images || [
    {
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
      publicId: "default",
    },
  ];

  const getImageUrl = (index: number) => {
    if (!productImages[index])
      return "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136";
    return typeof productImages[index] === "string"
      ? (productImages[index] as string)
      : (productImages[index] as { url: string; publicId: string }).url;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-bottom-default">
        <div className="page-container-tight">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>

      <div className="page-container-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="h-82 xl:h-96 w-full relative aspect-square rounded-lg overflow-hidden surface-card shadow-lg">
              <Image
                src={getImageUrl(selectedImage)}
                alt={product.nomProduit}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.stock < 10 && product.stock > 0 && (
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                  Stock faible
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive/90 text-destructive-foreground">
                  Rupture de stock
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 surface-glass"
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                />
              </Button>
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => {
                  const imgUrl = getImageUrl(index);
                  return (
                    <button
                      key={index}
                      className={`h-24 w-full relative aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-green-500 dark:border-green-400"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <div className="relative w-full h-full bg-muted">
                        <Image
                          src={imgUrl}
                          alt={`${product.nomProduit} vue ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 12.5vw"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Category */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {product.fournisseur?.nomEntreprise && (
                  <Badge variant="outline" className="text-sm">
                    {product.fournisseur.nomEntreprise}
                  </Badge>
                )}
                <Link
                  href={`/categories/${product.typeProduit || ""}`}
                  className="text-green-600 dark:text-green-400 hover:underline text-sm"
                >
                  {product.typeProduit || "Produits"}
                </Link>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.nomProduit}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 4.5)
                          ? "fill-yellow-400 text-yellow-400"
                          : i < (product.rating || 4.5)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {product.rating || 4.5} ({product.reviewsCount || 0} avis)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {product.prix.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {/* <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Caractéristiques
              </h3>
              <ul className="space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Stock Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Disponibilité
              </h3>
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    product.stock > 0 ? "bg-green-500" : "bg-destructive"
                  }`}
                ></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {product.stock > 0
                    ? `En stock (${product.stock} disponible${
                        product.stock > 1 ? "s" : ""
                      })`
                    : "Rupture de stock"}
                </span>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Quantité ({baseUnitLabel}):
                </span>
                <div className="flex items-center border-default rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() =>
                      setQuantity(
                        Math.max(
                          unitStep,
                          Number((quantity - unitStep).toFixed(3)),
                        ),
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          unitStep,
                          parseFloat(e.target.value) || unitStep,
                        ),
                      )
                    }
                    className="w-16 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    min={unitStep}
                    step={unitStep}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() =>
                      setQuantity(Number((quantity + unitStep).toFixed(3)))
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  Stock disponible:{" "}
                  <span className="font-medium text-green-600">
                    {stockValue} {stockUnitLabel}
                  </span>
                </span>
              </div>

              {/* Action Buttons */}
              {isAdmin ? (
                // Boutons pour admin
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() =>
                      router.push(`/produits/modifier/${product._id}`)
                    }
                  >
                    <Edit className="h-5 w-5 mr-2" />
                    Modifier le produit
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Refuser/Supprimer
                  </Button>
                </div>
              ) : isFournisseur && isOwner ? (
                // Boutons pour fournisseur - son propre produit
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() =>
                      router.push(`/produits/modifier/${product._id}`)
                    }
                  >
                    <Edit className="h-5 w-5 mr-2" />
                    Modifier le produit
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Supprimer le produit
                  </Button>
                </div>
              ) : isFournisseur && !isOwner ? (
                // Boutons pour fournisseur - produit d'un autre fournisseur
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    disabled
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Détails du produit
                  </Button>
                  <Button size="lg" variant="ghost" className="flex-1">
                    <Share2 className="h-5 w-5 mr-2" />
                    Partager
                  </Button>
                </div>
              ) : (
                // Boutons pour clients et fournisseurs (produits des autres)
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock === 0}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {addingToCart ? "Ajout en cours..." : "Ajouter au panier"}
                  </Button>
                  <Button size="lg" variant="outline" className="flex-1">
                    Acheter maintenant
                  </Button>
                  <Button variant="ghost" size="icon" className="h-12 w-12">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Delivery & Guarantee */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-top-default">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Livraison rapide
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    24-48h à Dakar
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Garantie satisfaction
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    30 jours pour changer d&apos;avis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <RotateCcw className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Retours faciles
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    15 jours pour retourner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-8 border-top-default">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Produits similaires
            </h2>
            <Link
              href={`/categories/${product.typeProduit}`}
              className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
            >
              Voir tout
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                href={`/produits/${relatedProduct._id}`}
                className="group surface-card-hover rounded-lg overflow-hidden"
              >
                <div className="relative aspect-square">
                  <div className="relative w-full h-full bg-muted">
                    <Image
                      src={
                        relatedProduct.images && relatedProduct.images[0]
                          ? typeof relatedProduct.images[0] === "string"
                            ? relatedProduct.images[0]
                            : relatedProduct.images[0].url
                          : "/images/placeholder-product.jpg"
                      }
                      alt={relatedProduct.nomProduit}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {relatedProduct.nomProduit}
                  </h3>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-2">
                    {relatedProduct.prix.toLocaleString()} FCFA
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est
              irréversible et supprimera également toutes les images et données
              associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn-destructive"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
