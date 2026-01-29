"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRoleAccess } from "@/lib/hooks/useRoleAccess";
import { ProductFormShared } from "@/components/products/ProductFormShared";
import { getProduitById, type Produit } from "@/lib/api/produits";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

export default function ModifierProduitPage() {
  useRoleAccess(["fournisseur", "admin"]);

  const router = useRouter();
  const params = useParams();
  const [produitId, setProduitId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [produit, setProduit] = useState<Produit | null>(null);

  // Récupérer l'ID depuis les params
  useEffect(() => {
    const id = params?.id as string;
    if (id) {
      setProduitId(id);
    }
  }, [params]);

  // Charger le produit
  useEffect(() => {
    const loadProduit = async () => {
      if (!produitId) return;

      try {
        setIsLoading(true);
        const data = await getProduitById(produitId);
        setProduit(data);
      } catch (error) {
        console.error("Erreur lors du chargement du produit:", error);
        toast.error("Erreur lors du chargement du produit");
        router.push("/produits/gestion");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduit();
  }, [produitId, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!produit) {
    return null;
  }

  return (
    <ProductFormShared
      mode="edit"
      initialData={produit}
      existingImages={produit.images || []}
      backPath="/produits/gestion"
      onSubmitSuccess={() => router.push("/produits/gestion")}
    />
  );
}
