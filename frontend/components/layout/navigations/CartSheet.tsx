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
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartSheet() {
  const cartItems = [
    {
      id: 1,
      name: "Produit 1",
      price: 15000,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=80&q=80",
    },
    {
      id: 2,
      name: "Produit 2",
      price: 25000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=80&q=80",
    },
    {
      id: 3,
      name: "Produit 3",
      price: 10000,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=80&q=80",
    },
    {
      id: 4,
      name: "Produit 4",
      price: 20000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=80&q=80",
    }
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 5000;
  const total = subtotal + shipping;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:text-black hover:dark:hover:text-white hover:bg-green-500 dark:hover:bg-green-900"
        >
          <ShoppingCart className="h-5 w-5" />
          <Badge className="bg-green-500 absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
            {cartItems.length}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Panier ({cartItems.length} articles)</SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Qtté: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-green-600 mt-1">
                    {item.price * item.quantity} FCFA
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 h-8 w-8"
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
                <span className="font-semibold">{shipping} FCFA</span>
              </div>
              <div className="flex justify-between pt-2 border-t text-base font-bold">
                <span>Total</span>
                <span className="text-green-600">{total} FCFA</span>
              </div>
            </div>

            <div className="space-y-2">
              <SheetClose asChild>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Paiement
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/panier">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Voir tous les articles
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
