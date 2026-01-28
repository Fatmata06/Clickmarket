"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CartSheet() {
  const { cart, isLoading, itemCount, total, updateQuantity, removeItem } =
    useCart();

  const cartItems = cart?.articles || [];
  const subtotal = total;

  const handleQuantityChange = async (
    articleId: string,
    currentQuantite: number,
    change: number,
  ) => {
    const newQuantite = currentQuantite + change;
    if (newQuantite > 0) {
      await updateQuantity(articleId, newQuantite);
    }
  };

  if (isLoading) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:text-black hover:dark:hover:text-white hover:bg-green-500 dark:hover:bg-green-900"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:w-[400px] flex flex-col"
        >
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:text-black hover:dark:hover:text-white hover:bg-green-500 dark:hover:bg-green-900"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="bg-green-500 absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Panier ({itemCount} articles)</SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <Image
                  src={item.produit?.images?.[0]?.url || "/placeholder.png"}
                  alt={item.produit?.nomProduit || "Produit"}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {item.produit?.nomProduit}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.prixUnitaire} FCFA / unité
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantite, -1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-medium w-6 text-center">
                      {item.quantite}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantite, 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="text-sm font-semibold text-green-600 mt-2">
                    {item.total} FCFA
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 h-8 w-8"
                  onClick={() => removeItem(item._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-2 opacity-50" />
              <p>Panier vide</p>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-semibold">{subtotal} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span className="font-semibold">—</span>
              </div>
              <div className="flex justify-between pt-2 border-t text-base font-bold">
                <span>Total</span>
                <span className="text-green-600">{subtotal} FCFA</span>
              </div>
            </div>

            <div className="space-y-2">
              <SheetClose asChild>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  asChild
                >
                  <Link href="/panier">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Voir le panier
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/produits">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Continuer les achats
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
