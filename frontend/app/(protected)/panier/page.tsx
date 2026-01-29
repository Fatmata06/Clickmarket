"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { createCommande } from "@/lib/api/commandes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmCommandeDialog } from "@/components/commandes/ConfirmCommandeDialog";

export default function PanierPage() {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const router = useRouter();

  const cartItems = cart?.articles || [];

  // Calculer le sous-total (somme de tous les totaux des produits)
  const subtotal = cartItems.reduce((sum, item) => {
    const itemTotal = item.total || item.quantite * item.prixUnitaire;
    return sum + itemTotal;
  }, 0);

  const handleQuantityChange = async (
    articleId: string,
    currentQuantite: number,
    change: number,
  ) => {
    const newQuantite = currentQuantite + change;
    if (newQuantite > 0) {
      setUpdatingId(articleId);
      try {
        await updateQuantity(articleId, newQuantite);
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const handleRemoveItem = async (articleId: string) => {
    setUpdatingId(articleId);
    try {
      await removeItem(articleId);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    try {
      setCreatingOrder(true);
      const newCommande = await createCommande({
        methodeLivraison: "livraison",
      });
      toast.success("Commande créée avec succès !");
      setConfirmDialogOpen(false);
      router.push(`/commandes/${newCommande._id}`);
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      toast.error(
        (error as Error).message || "Erreur lors de la création de la commande",
      );
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleOpenConfirmDialog = () => {
    if (cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    setConfirmDialogOpen(true);
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mon Panier
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {cartItems.length} article{cartItems.length !== 1 ? "s" : ""} dans
            votre panier
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => {
                const itemTotal =
                  item.total || item.quantite * item.prixUnitaire;
                return (
                  <Card key={item._id}>
                    <CardContent className="flex items-center gap-4 pt-6">
                      <Image
                        src={
                          item.produit?.images?.[0]?.url || "/placeholder.png"
                        }
                        alt={item.produit?.nomProduit || "Produit"}
                        width={100}
                        height={100}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {item.produit?.nomProduit}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.prixUnitaire} FCFA / unité
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={updatingId === item._id}
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantite, -1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-medium w-8 text-center">
                            {item.quantite}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={updatingId === item._id}
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantite, 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{itemTotal} FCFA</p>
                        <p className="text-sm text-muted-foreground">
                          {item.prixUnitaire} FCFA x {item.quantite}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        disabled={updatingId === item._id}
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        {updatingId === item._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Votre panier est vide</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Résumé */}
          <Card className="h-fit sticky top-20">
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-semibold">{subtotal} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span className="font-semibold">—</span>
              </div>
              <div className="border-t pt-4 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold text-green-600">
                  {subtotal} FCFA
                </span>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={cartItems.length === 0 || isLoading}
                onClick={handleOpenConfirmDialog}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Commander
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dialog de confirmation */}
        <ConfirmCommandeDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          cartItems={cartItems}
          isLoading={creatingOrder}
          onConfirm={handleCreateOrder}
        />
      </div>
    </ProtectedLayout>
  );
}
