// components/products/ProductsGrid.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Pommes Golden Bio",
    description: "Pommes sucrées et croquantes, cultivées sans pesticides",
    price: 2500,
    originalPrice: 3000,
    rating: 4.8,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=400",
    category: "Fruits",
    tags: ["Bio", "Local"],
    inStock: true,
  },
  {
    id: 2,
    name: "Carottes Fraîches",
    description: "Carottes sucrées et croquantes, récoltées quotidiennement",
    price: 1500,
    originalPrice: null,
    rating: 4.5,
    reviews: 89,
    image:
      "https://res.cloudinary.com/ds5zfxlhf/image/upload/v1766754223/k8-GHRT9j21m2M-unsplash_aklg6f.jpg?auto=format&fit=crop&w=400",
    category: "Légumes",
    tags: ["Frais"],
    inStock: true,
  },
  {
    id: 3,
    name: "Avocats Hass",
    description: "Avocats crémeux parfaits pour vos toasts et salades",
    price: 1200,
    originalPrice: 1500,
    rating: 4.9,
    reviews: 204,
    image:
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400",
    category: "Fruits",
    tags: ["Exotique"],
    inStock: false,
  },
  {
    id: 4,
    name: "Salade Laitue",
    description: "Laitue croquante pour vos salades fraîches",
    price: 800,
    originalPrice: null,
    rating: 4.3,
    reviews: 56,
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400",
    category: "Légumes",
    tags: ["Bio"],
    inStock: true,
  },
  {
    id: 5,
    name: "Tomates Cerises",
    description: "Tomates cerises sucrées pour apéritifs et salades",
    price: 1800,
    originalPrice: 2200,
    rating: 4.7,
    reviews: 167,
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400",
    category: "Légumes",
    tags: ["Local"],
    inStock: true,
  },
  {
    id: 6,
    name: "Bananes Plantains",
    description: "Bananes plantains parfaites pour vos plats traditionnels",
    price: 2000,
    originalPrice: null,
    rating: 4.6,
    reviews: 92,
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400",
    category: "Fruits",
    tags: ["Local"],
    inStock: true,
  },
];

export default function ProductsGrid() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden border-0 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="relative">
            <div className="relative h-48">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    product.inStock
                      ? "bg-green-700 text-white dark:bg-green-900 dark:text-white"
                      : "bg-red-700 text-white dark:bg-red-900 dark:text-white"
                  }`}
                >
                  {product.inStock ? "En stock" : "Rupture"}
                </span>
              </div>
              <div className="absolute top-3 left-3 flex gap-2">
                {product.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
              >
                <Heart
                  className={`h-5 w-5 ${
                    favorites.includes(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
              {!product.inStock && (
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
                  {product.category}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium dark:text-gray-300">
                  {product.rating} ({product.reviews})
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-lg dark:text-white line-clamp-1">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {product.price.toLocaleString()} F
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                    {product.originalPrice.toLocaleString()} F
                  </span>
                )}
              </div>
              {/* <span className={`text-sm px-2 py-1 rounded ${product.inStock ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                {product.inStock ? 'En stock' : 'Rupture'}
              </span> */}
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 p-4 pt-0">
            <Button
              className="flex-1 bg-green-600 text-white hover:bg-green-700 hover:text-white dark:bg-green-700 dark:hover:bg-green-600"
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-0" />
              Ajouter au panier
            </Button>

            <Link
              href={`/produits/${product.id}`}
              className="h-full flex items-center justify-center px-3 rounded-md border border-gray-800 dark:border-gray-600
               text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
