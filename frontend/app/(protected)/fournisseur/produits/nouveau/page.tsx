"use client";

import { useRoleAccess } from "@/lib/hooks/useRoleAccess";
import { ProductFormShared } from "@/components/products/ProductFormShared";

export default function FournisseurNouveauProduitPage() {
  useRoleAccess(["fournisseur"]);

  return <ProductFormShared mode="create" backPath="/fournisseur/produits" />;
}
