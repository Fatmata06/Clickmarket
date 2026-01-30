// app/categories/page.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  ArrowRight,
  Leaf,
  TrendingUp,
  Clock,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

export default function CategoriesPage() {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const fruitProducts = useProducts({ typeProduit: "fruits", limit: 1 });
  const vegetableProducts = useProducts({ typeProduit: "legumes", limit: 1 });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
    description: string;
    image: string;
    icon: string;
    slug: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    icon: "",
  });

  // Vérifier si l'utilisateur est admin
  const isAdmin = useMemo(() => {
    const authData = localStorage.getItem("clickmarket_auth");
    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        return user?.role === "admin";
      } catch (error) {
        console.error(
          "Erreur lors de la lecture des données utilisateur:",
          error,
        );
        return false;
      }
    }
    return false;
  }, []);

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

  // Gestion des catégories
  const handleAddCategory = () => {
    setFormData({ name: "", description: "", image: "", icon: "" });
    setAddDialogOpen(true);
  };

  const handleEditCategory = (
    category: {
      id: number;
      name: string;
      description: string;
      image: string;
      icon: string;
      slug: string;
    },
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
      icon: category.icon,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteCategory = (
    category: {
      id: number;
      name: string;
      description: string;
      image: string;
      icon: string;
      slug: string;
    },
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleSubmitAdd = async () => {
    try {
      // TODO: Implémenter l'appel API pour ajouter une catégorie
      toast.success("Catégorie ajoutée avec succès");
      setAddDialogOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
      toast.error("Erreur lors de l'ajout de la catégorie");
    }
  };

  const handleSubmitEdit = async () => {
    try {
      // TODO: Implémenter l'appel API pour modifier une catégorie
      toast.success("Catégorie modifiée avec succès");
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      toast.error("Erreur lors de la modification de la catégorie");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      // TODO: Implémenter l'appel API pour supprimer une catégorie
      toast.success("Catégorie supprimée avec succès");
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      toast.error("Erreur lors de la suppression de la catégorie");
    }
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-background dark:from-gray-900 dark:to-gray-950">
      <div className="page-container">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Nos{" "}
              <span className="text-green-600 dark:text-green-400">
                Catégories
              </span>
            </h1>
            {isAdmin && (
              <Button
                onClick={handleAddCategory}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ajouter une catégorie
              </Button>
            )}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez notre large sélection de produits frais, organisés par
            catégories pour faciliter vos achats
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-lg dark:shadow-gray-900/50">
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

          <Card className="shadow-lg dark:shadow-gray-900/50">
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

          <Card className="shadow-lg dark:shadow-gray-900/50">
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
            <div key={category.id} className="relative group">
              <Link href={`/categories/${category.slug}`} className="block">
                <Card className="shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900 transition-all duration-300 overflow-hidden h-full">
                  <div className="relative h-48">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 rounded-full surface-glass flex items-center justify-center text-2xl">
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

              {/* Boutons admin */}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={(e) => handleEditCategory(category, e)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => handleDeleteCategory(category, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
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
                className="px-8 border-border text-foreground"
              >
                Voir tous les produits
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dialog Ajouter une catégorie */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
            <DialogDescription>
              Remplissez les informations de la nouvelle catégorie
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la catégorie</Label>
              <Input
                id="name"
                placeholder="Ex: Fruits Frais"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description de la catégorie"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">URL de l&apos;image</Label>
              <Input
                id="image"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icône (emoji)</Label>
              <Input
                id="icon"
                placeholder="🍎"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSubmitAdd}
              className="bg-green-600 hover:bg-green-700"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifier une catégorie */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la catégorie
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nom de la catégorie</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">URL de l&apos;image</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-icon">Icône (emoji)</Label>
              <Input
                id="edit-icon"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSubmitEdit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Supprimer une catégorie */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement la catégorie &quot;
              {selectedCategory?.name}&quot;. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="btn-destructive"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
