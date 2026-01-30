"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Mapping des catégories avec leurs images et couleurs
const categoryConfig: Record<
  string,
  {
    image: string;
    color: string;
    textColor: string;
    displayName: string;
  }
> = {
  fruits: {
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400",
    color: "bg-orange-50",
    textColor: "text-orange-700",
    displayName: "Fruits Frais",
  },
  legumes: {
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400",
    color: "bg-green-50",
    textColor: "text-green-700",
    displayName: "Légumes Bio",
  },
  exotiques: {
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400",
    color: "bg-purple-50",
    textColor: "text-purple-700",
    displayName: "Produits Exotiques",
  },
  paniers: {
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400",
    color: "bg-blue-50",
    textColor: "text-blue-700",
    displayName: "Paniers Prêts",
  },
};

export default function CategoriesSection() {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-sm text-muted-foreground animate-pulse">
            Chargement des catégories depuis le serveur...
          </p>
        </div>
      </div>
    );
  }

  if (error || !categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Aucune catégorie disponible pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {categories.map((category, index) => {
        const config = categoryConfig[category.toLowerCase()] || {
          image:
            "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400",
          color: "bg-gray-50",
          textColor: "text-gray-700",
          displayName: category,
        };

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative h-48">
                  <Image
                    src={config.image}
                    alt={config.displayName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/60 to-transparent">
                    <h3 className="text-xl font-bold text-white">
                      {config.displayName}
                    </h3>
                  </div>
                </div>
                <div className={`p-4 ${config.color}`}>
                  <Link href={`/categories/${category.toLowerCase()}`}>
                    <Button
                      className={`w-full justify-between ${config.textColor} cursor-pointer`}
                      variant="ghost"
                    >
                      Voir tous
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
