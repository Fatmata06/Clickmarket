"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";

export default function FavorisPage() {
  const favorites = [
    {
      id: 1,
      name: "Produit 1",
      price: 15000,
      rating: 4.5,
      image: "https://res.cloudinary.com/ds5zfxlhf/image/upload/v1767824814/clickmarche/produits/essh8m0nedejxauggo3z.jpg",
    },
    {
      id: 2,
      name: "Produit 2",
      price: 25000,
      rating: 4.8,
      image: "https://res.cloudinary.com/ds5zfxlhf/image/upload/v1767824814/clickmarche/produits/essh8m0nedejxauggo3z.jpg",
    },
    {
      id: 3,
      name: "Produit 3",
      price: 35000,
      rating: 4.2,
      image: "https://res.cloudinary.com/ds5zfxlhf/image/upload/v1767824814/clickmarche/produits/essh8m0nedejxauggo3z.jpg",
    },
    {
      id: 4,
      name: "Produit 4",
      price: 12000,
      rating: 4.6,
      image: "https://res.cloudinary.com/ds5zfxlhf/image/upload/v1767824814/clickmarche/produits/essh8m0nedejxauggo3z.jpg",
    },
  ];

  return (
    <ProtectedLayout>
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mes Favoris
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {favorites.length} produit{favorites.length !== 1 ? "s" : ""} dans vos
          favoris
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </Button>
              </div>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm text-yellow-500">★</span>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} (25 avis)
                    </span>
                  </div>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {product.price} FCFA
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ajouter au panier
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir les détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Vous n&apos;avez pas de favoris</p>
          </CardContent>
        </Card>
      )}
      </div>
    </ProtectedLayout>
  );
}
