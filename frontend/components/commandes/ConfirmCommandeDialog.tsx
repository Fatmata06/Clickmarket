"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/lib/api/cart";

interface ConfirmCommandeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  isLoading?: boolean;
  onConfirm: () => Promise<void>;
}

export function ConfirmCommandeDialog({
  open,
  onOpenChange,
  cartItems,
  isLoading = false,
  onConfirm,
}: ConfirmCommandeDialogProps) {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);

  if (cartItems.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Panier vide
            </DialogTitle>
            <DialogDescription>
              Votre panier est vide. Veuillez ajouter des produits avant de
              créer une commande.
            </DialogDescription>
          </DialogHeader>
          <Card>
            <CardContent className="py-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun article</h3>
                <p className="text-muted-foreground mb-4">
                  Visitez la page produits pour sélectionner les articles que
                  vous souhaitez ajouter à votre panier.
                </p>
              </div>
            </CardContent>
          </Card>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Link href="/produits">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Parcourir les produits
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Confirmer votre commande
          </DialogTitle>
          <DialogDescription>
            Veuillez vérifier les articles de votre panier avant de confirmer
          </DialogDescription>
        </DialogHeader>

        {/* Articles du panier */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {cartItems.map((item) => (
            <Card key={item._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    {item.produit.images && item.produit.images[0] ? (
                      <Image
                        src={item.produit.images[0]?.url || "/placeholder.png"}
                        alt={item.produit.nomProduit}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Infos produit */}
                  <div className="flex-1">
                    <h4 className="font-semibold line-clamp-1">
                      {item.produit.nomProduit}
                    </h4>
                    <p className="text-sm text-muted-foreground">Fournisseur</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">Qté: {item.quantite}</Badge>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {item.prixUnitaire.toLocaleString()} FCFA
                    </p>
                    <p className="font-semibold">
                      {item.total.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Résumé */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Résumé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{totalPrice.toLocaleString()} FCFA</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-emerald-600">
                  {totalPrice.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              "Confirmer la commande"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
