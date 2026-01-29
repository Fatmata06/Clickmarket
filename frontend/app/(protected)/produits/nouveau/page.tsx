"use client";

import { useRoleAccess } from "@/lib/hooks/useRoleAccess";
import { ProductFormShared } from "@/components/products/ProductFormShared";

export default function NouveauProduitPage() {
  useRoleAccess(["admin", "fournisseur"]);

  return <ProductFormShared mode="create" backPath="/produits/gestion" />;
}
