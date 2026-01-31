"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  createProduit,
  updateProduit,
  deleteImageProduit,
  type Produit,
} from "@/lib/api/produits";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useImageUpload } from "@/lib/hooks/useImageUpload";

interface ProductFormData {
  nomProduit: string;
  typeProduit: "fruits" | "legumes";
  description: string;
  prix: string;
  stock: string;
  uniteNom: string;
  unitePas: string;
  tags: string;
  statutValidation?: "en_attente" | "accepte" | "refuse";
}

interface ProductFormSharedProps {
  mode: "create" | "edit";
  initialData?: Produit;
  existingImages?: Array<{ _id?: string; url: string; publicId: string }>;
  onSubmitSuccess?: () => void;
  backPath?: string;
}

export function ProductFormShared({
  mode,
  initialData,
  existingImages = [],
  onSubmitSuccess,
  backPath = "/dashboard",
}: ProductFormSharedProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [remainingImages, setRemainingImages] = useState(existingImages);
  const [originalImages, setOriginalImages] = useState(existingImages);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  const {
    imageFiles,
    previewImages,
    handleImageChange: handleNewImageChange,
    removeImage: removeNewImage,
  } = useImageUpload(5);

  useEffect(() => {
    // Récupérer le rôle utilisateur
    const authData = localStorage.getItem("clickmarket_auth");
    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        setUserRole(user?.role || "");
      } catch (error) {
        console.error("Erreur lors de la lecture du rôle utilisateur:", error);
      }
    }
  }, []);

  useEffect(() => {
    setRemainingImages(existingImages);
    setOriginalImages(existingImages);
  }, [existingImages]);

  const [formData, setFormData] = useState<ProductFormData>({
    nomProduit: initialData?.nomProduit || "",
    typeProduit: initialData?.typeProduit || "fruits",
    description: initialData?.description || "",
    prix: initialData?.prix?.toString() || "",
    stock: initialData?.stock?.toString() || "",
    uniteNom: initialData?.uniteVente?.nom || "kg",
    unitePas: initialData?.uniteVente?.pas?.toString() || "0.25",
    tags: initialData?.tags?.join(", ") || "",
    statutValidation: initialData?.statutValidation || "en_attente",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const removeExistingImage = async (index: number) => {
    const image = remainingImages[index];
    if (!image) return;

    if (!initialData?._id || !image._id) {
      setRemainingImages((prev) => prev.filter((_, i) => i !== index));
      toast.error("Impossible de supprimer cette image maintenant");
      return;
    }

    try {
      setRemovingImageId(image._id);
      setRemainingImages((prev) => prev.filter((_, i) => i !== index));
      await deleteImageProduit(initialData._id, image._id);
      toast.success("Image supprimée avec succès");
    } catch (error) {
      setRemainingImages((prev) => {
        const next = [...prev];
        next.splice(index, 0, image);
        return next;
      });
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression de l'image",
      );
    } finally {
      setRemovingImageId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.nomProduit.trim()) {
        toast.error("Le nom du produit est requis");
        return;
      }
      if (!formData.prix || parseFloat(formData.prix) <= 0) {
        toast.error("Le prix doit être supérieur à 0");
        return;
      }
      if (!formData.stock || parseInt(formData.stock) < 0) {
        toast.error("Le stock ne peut pas être négatif");
        return;
      }

      // Vérifier les images
      const totalImages = remainingImages.length + imageFiles.length;
      if (totalImages === 0) {
        toast.error("Veuillez ajouter au moins une image");
        return;
      }

      const imagesToDelete =
        mode === "edit"
          ? originalImages
              .filter(
                (img) =>
                  !remainingImages.some(
                    (remaining) =>
                      remaining.publicId === img.publicId ||
                      remaining._id === img._id,
                  ),
              )
              .map((img) => img._id || img.publicId)
          : [];

      const productData = {
        nomProduit: formData.nomProduit.trim(),
        typeProduit: formData.typeProduit,
        description: formData.description.trim(),
        prix: parseFloat(formData.prix),
        stock: parseInt(formData.stock),
        uniteVente: JSON.stringify({
          nom: formData.uniteNom,
          pas: parseFloat(formData.unitePas),
        }),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        images: imageFiles,
        imagesToDelete: imagesToDelete.length > 0 ? imagesToDelete : undefined,
        ...(userRole === "admin" && mode === "edit" && {
          statutValidation: formData.statutValidation,
        }),
      };

      if (mode === "create") {
        await createProduit(productData);
        toast.success("Produit créé avec succès !");
      } else if (initialData?._id) {
        await updateProduit(initialData._id, productData);
        toast.success("Produit mis à jour avec succès !");
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        router.push(backPath);
      }
    } catch (error) {
      console.error(
        `Erreur lors de ${mode === "create" ? "la création" : "la mise à jour"} du produit:`,
        error,
      );
      toast.error(
        error instanceof Error
          ? error.message
          : `Erreur lors de ${mode === "create" ? "la création" : "la mise à jour"} du produit`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {mode === "create" ? "Nouveau Produit" : "Modifier le Produit"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom du produit */}
            <div className="space-y-2">
              <Label htmlFor="nomProduit">Nom du produit *</Label>
              <Input
                id="nomProduit"
                name="nomProduit"
                value={formData.nomProduit}
                onChange={handleInputChange}
                placeholder="Ex: Tomates fraîches"
                required
                disabled={isLoading}
              />
            </div>

            {/* Type de produit */}
            <div className="space-y-2">
              <Label htmlFor="typeProduit">Type de produit *</Label>
              <Select
                value={formData.typeProduit}
                onValueChange={(value: "fruits" | "legumes") =>
                  setFormData((prev) => ({ ...prev, typeProduit: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="legumes">Légumes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statut de validation (Admin uniquement) */}
            {mode === "edit" && userRole === "admin" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="statutValidation">Statut de validation</Label>
                  <Badge
                    className={
                      formData.statutValidation === "accepte"
                        ? "bg-green-100 text-green-800"
                        : formData.statutValidation === "refuse"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-amber-100 text-amber-800"
                    }
                  >
                    {formData.statutValidation === "accepte"
                      ? "Accepté"
                      : formData.statutValidation === "refuse"
                        ? "Refusé"
                        : "En attente"}
                  </Badge>
                </div>
                <Select
                  value={formData.statutValidation || "en_attente"}
                  onValueChange={(value: "en_attente" | "accepte" | "refuse") =>
                    setFormData((prev) => ({
                      ...prev,
                      statutValidation: value,
                    }))
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="accepte">Accepté</SelectItem>
                    <SelectItem value="refuse">Refusé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez votre produit..."
                rows={4}
                required
                disabled={isLoading}
              />
            </div>

            {/* Prix et Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prix">Prix (FCFA) *</Label>
                <Input
                  id="prix"
                  name="prix"
                  type="number"
                  step="0.01"
                  value={formData.prix}
                  onChange={handleInputChange}
                  placeholder="500"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="100"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Unité de vente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="uniteNom">Unité de vente *</Label>
                <Select
                  value={formData.uniteNom}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, uniteNom: value }))
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogramme (kg)</SelectItem>
                    <SelectItem value="g">Gramme (g)</SelectItem>
                    <SelectItem value="l">Litre (l)</SelectItem>
                    <SelectItem value="unite">Unité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitePas">Pas d&apos;incrémentation *</Label>
                <Input
                  id="unitePas"
                  name="unitePas"
                  type="number"
                  step="0.01"
                  value={formData.unitePas}
                  onChange={handleInputChange}
                  placeholder="0.25"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="bio, frais, local"
                disabled={isLoading}
              />
            </div>

            {/* Images existantes (mode édition) */}
            {mode === "edit" && remainingImages.length > 0 && (
              <div className="space-y-2">
                <Label>Images actuelles</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {remainingImages.map((image, index) => (
                    <div key={image.publicId} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-border">
                        <Image
                          src={image.url}
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExistingImage(index)}
                        disabled={isLoading || removingImageId === image._id}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload d'images */}
            <div className="space-y-2">
              <Label htmlFor="images">
                {mode === "edit" ? "Ajouter de nouvelles images" : "Images *"}{" "}
                (max 5)
              </Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("images")?.click()}
                  disabled={
                    isLoading ||
                    previewImages.length + remainingImages.length >= 5
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choisir des images
                </Button>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImageChange}
                  className="hidden"
                  disabled={
                    isLoading ||
                    previewImages.length + remainingImages.length >= 5
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {previewImages.length + remainingImages.length} / 5 images
                </span>
              </div>

              {/* Prévisualisation des nouvelles images */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary">
                        <Image
                          src={preview}
                          alt={`Aperçu ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeNewImage(index)}
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "create" ? "Création..." : "Mise à jour..."}
                  </>
                ) : mode === "create" ? (
                  "Créer le produit"
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
