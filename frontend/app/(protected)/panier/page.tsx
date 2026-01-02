"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function PanierPage() {
  const cartItems = [
    {
      id: 1,
      name: "Produit 1",
      price: 15000,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Produit 2",
      price: 25000,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 5000;
  const total = subtotal + shipping;

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
            cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantité: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {item.price * item.quantity} FCFA
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.price} FCFA x {item.quantity}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
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
              <span className="font-semibold">{shipping} FCFA</span>
            </div>
            <div className="border-t pt-4 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold text-green-600">
                {total} FCFA
              </span>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={cartItems.length === 0}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Procéder au paiement
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </ProtectedLayout>
  );
}
