"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
// import { Breadcrumb } from "@/components/ui/breadcrumb";
import Breadcrumb from "@/components/breadcrumb";
import { useProduct } from "@/hooks/useProduct";
import { useCart } from "@/context/cart-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useProducts } from "@/hooks/useProducts";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { product, isLoading, error } = useProduct(resolvedParams.id);
  const { products: relatedProducts } = useProducts({ limit: 3 });
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Produit non trouvé
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || "Ce produit n'existe pas ou a été supprimé"}
          </p>
          <Link href="/produits">
            <Button>Retour aux produits</Button>
          </Link>
        </div>
      </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="h-82 xl:h-96 w-full relative aspect-square rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
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
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  Rupture de stock
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
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
                      <div className="relative w-full h-full bg-gray-100 dark:bg-gray-700">
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
                    product.stock > 0 ? "bg-green-500" : "bg-red-500"
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
                  Quantité:
                </span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    min="1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  Stock disponible:{" "}
                  <span className="font-medium text-green-600">
                    {product.stock} unité{product.stock > 1 ? "s" : ""}
                  </span>
                </span>
              </div>

              {/* Action Buttons */}
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
            </div>

            {/* Delivery & Guarantee */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
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
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
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
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative aspect-square">
                  <div className="relative w-full h-full bg-gray-100 dark:bg-gray-700">
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
    </div>
  );
}
