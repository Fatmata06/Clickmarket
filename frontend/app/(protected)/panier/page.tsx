"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { createCommande } from "@/lib/api/commandes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmCommandeDialog } from "@/components/commandes/ConfirmCommandeDialog";
import { DeliveryMethodDialog } from "@/components/commandes/DeliveryMethodDialog";

export default function PanierPage() {
  const {
    cart,
    isLoading,
    updateQuantity,
    removeItem,
    clearCartItems,
    refreshCart,
  } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const cartItems = cart?.articles || [];

  // Rediriger les admins et fournisseurs vers le dashboard
  useEffect(() => {
    if (
      !authLoading &&
      (user?.role === "admin" || user?.role === "fournisseur")
    ) {
      setIsRedirecting(true);
      const message =
        user?.role === "admin"
          ? "Les administrateurs n'ont pas accès au panier"
          : "Les fournisseurs n'ont pas accès au panier";
      toast.error(message);
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  if (isRedirecting || (authLoading && user?.role === "admin")) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ProtectedLayout>
    );
  }

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

  const handleCreateOrder = async (data: {
    methodeLivraison: "livraison" | "retrait";
    adresseLivraison?: string;
    zoneLivraison?: string;
  }) => {
    if (cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    try {
      setCreatingOrder(true);
      const newCommande = await createCommande({
        methodeLivraison: data.methodeLivraison,
        adresseLivraison: data.adresseLivraison,
        zoneLivraison: data.zoneLivraison,
      });

      // Vider le panier après succès (silencieusement)
      await clearCartItems(true);
      await refreshCart();

      toast.success("Commande créée avec succès !");
      setConfirmDialogOpen(false);
      setDeliveryDialogOpen(false);
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

  const handleClearCart = async () => {
    try {
      setIsClearing(true);
      await clearCartItems?.();
      toast.success("Panier vidé");
      setClearCartDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors du vidage du panier:", error);
      toast.error("Erreur lors du vidage du panier");
    } finally {
      setIsClearing(false);
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="stack-8">
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
                                handleQuantityChange(
                                  item._id,
                                  item.quantite,
                                  -1,
                                )
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
                    <p className="text-muted-foreground">
                      Votre panier est vide
                    </p>
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
                <Button
                  variant="destructive"
                  className="w-full btn-destructive"
                  disabled={cartItems.length === 0 || isLoading || isClearing}
                  onClick={() => setClearCartDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider le panier
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Dialog de confirmation pour vider le panier */}
          <Dialog
            open={clearCartDialogOpen}
            onOpenChange={setClearCartDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vider le panier</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer tous les articles de votre
                  panier ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setClearCartDialogOpen(false)}
                  disabled={isClearing}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="btn-destructive"
                >
                  {isClearing ? "Suppression..." : "Confirmer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog de confirmation */}
          <ConfirmCommandeDialog
            open={confirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
            cartItems={cartItems}
            isLoading={creatingOrder}
            onConfirm={async () => {
              setConfirmDialogOpen(false);
              setDeliveryDialogOpen(true);
            }}
          />

          {/* Dialog de sélection de la méthode de livraison */}
          <DeliveryMethodDialog
            open={deliveryDialogOpen}
            onOpenChange={setDeliveryDialogOpen}
            onConfirm={handleCreateOrder}
            isLoading={creatingOrder}
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}
