"use client";

import { useState } from "react";
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

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = {
    id: 1,
    name: "Huile d'Olive Extra Vierge BIO 1L",
    category: "Huiles & Vinaigres",
    brand: "BioNature",
    price: 4500,
    originalPrice: 5200,
    discount: 13,
    rating: 4.5,
    reviews: 128,
    description: "Huile d'olive extra vierge biologique, première pression à froid. Produit local de qualité supérieure, riche en antioxydants et en goût.",
    features: [
      "Certifié Agriculture Biologique",
      "Première pression à froid",
      "Produit local du Sénégal",
      "Riche en antioxydants",
      "Bouteille en verre recyclable"
    ],
    specifications: {
      "Volume": "1 Litre",
      "Type": "Extra Vierge",
      "Origine": "Sénégal",
      "Certification": "Bio",
      "Conservation": "À l'abri de la lumière"
    },
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"
    ]
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Vinaigre de Cidre BIO 750ml",
      price: 2800,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"
    },
    {
      id: 3,
      name: "Huile d'Arachide 1L",
      price: 3200,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"
    },
    {
      id: 4,
      name: "Sauce Tomate BIO 500g",
      price: 1800,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"
    }
  ];

  const breadcrumbs = [
    { label: "Accueil", href: "/" },
    { label: "Produits", href: "/produits" },
    { label: product.category, href: `/categories/${product.category.toLowerCase()}` },
    { label: product.name, href: `#` }
  ];

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
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                -{product.discount}%
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
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
                      src={image}
                      alt={`${product.name} vue ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Category */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {product.brand}
                </Badge>
                <Link
                  href={`/categories/${product.category.toLowerCase()}`}
                  className="text-green-600 dark:text-green-400 hover:underline text-sm"
                >
                  {product.category}
                </Link>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : i < product.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {product.price.toLocaleString()} FCFA
                </span>
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()} FCFA
                </span>
              </div>
              <p className="text-green-600 dark:text-green-400 font-medium">
                Économisez {(product.originalPrice - product.price).toLocaleString()} FCFA
              </p>
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

            {/* Specifications */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Spécifications
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">{key}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Quantité:</span>
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
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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
                  Stock disponible: <span className="font-medium text-green-600">50 unités</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                >
                  Acheter maintenant
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12"
                >
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
                  <p className="font-medium text-gray-900 dark:text-white">Livraison rapide</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">24-48h à Dakar</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Garantie satisfaction</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">30 jours pour changer d&apos;avis</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <RotateCcw className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Retours faciles</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">15 jours pour retourner</p>
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
              href={`/categories/${product.category.toLowerCase()}`}
              className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
            >
              Voir tout
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/produits/${relatedProduct.id}`}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative aspect-square">
                  <div className="relative w-full h-full bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-2">
                    {relatedProduct.price.toLocaleString()} FCFA
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