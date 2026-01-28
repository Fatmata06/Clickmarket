// app/categories/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, TrendingUp, Clock } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CategoriesPage() {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const fruitProducts = useProducts({ typeProduit: "fruits", limit: 1 });
  const vegetableProducts = useProducts({ typeProduit: "legumes", limit: 1 });

  // Build dynamic categories based on database
  const dynamicCategories = categories.map((cat, index) => {
    const productData = index === 0 ? fruitProducts : vegetableProducts;

    return {
      id: index + 1,
      slug: cat.toLowerCase(),
      name:
        cat === "fruits"
          ? "Fruits Frais"
          : cat === "legumes"
            ? "Légumes Bio"
            : cat.charAt(0).toUpperCase() + cat.slice(1),
      description:
        cat === "fruits"
          ? "Une sélection de fruits de saison, cultivés localement"
          : cat === "legumes"
            ? "Légumes cultivés sans pesticides ni engrais chimiques"
            : `Découvrez notre sélection de ${cat}`,
      count: productData.total || 0,
      image:
        cat === "fruits"
          ? "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600"
          : "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600",
      color:
        cat === "fruits"
          ? "bg-orange-50 dark:bg-orange-950/20"
          : "bg-green-50 dark:bg-green-950/20",
      icon: cat === "fruits" ? "🍎" : "🥕",
      popular: true,
    };
  });

  if (categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nos{" "}
            <span className="text-green-600 dark:text-green-400">
              Catégories
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez notre large sélection de produits frais, organisés par
            catégories pour faciliter vos achats
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg dark:shadow-gray-900/50 dark:bg-gray-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dynamicCategories.reduce((sum, cat) => sum + cat.count, 0)}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Produits frais
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg dark:shadow-gray-900/50 dark:bg-gray-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  98%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Satisfaction client
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg dark:shadow-gray-900/50 dark:bg-gray-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  24h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Livraison maximum
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dynamicCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block"
            >
              <Card className="border-0 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900 transition-all duration-300 overflow-hidden h-full dark:bg-gray-800">
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center text-2xl">
                      {category.icon}
                    </div>
                  </div>
                  {category.popular && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                        Populaire
                      </span>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count} produits
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform"
                    >
                      Voir tous
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Contactez-nous directement pour des demandes spéciales ou des
            produits spécifiques
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Contactez-nous
            </Button>
            <Link href="/produits">
              <Button
                size="lg"
                variant="outline"
                className="px-8 dark:border-gray-600 dark:text-gray-300"
              >
                Voir tous les produits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
