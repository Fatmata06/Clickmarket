// context/cart-context.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Cart,
  getCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/lib/api/cart";
import { toast } from "sonner";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  total: number;
  addToCart: (produitId: string, quantite?: number) => Promise<void>;
  updateQuantity: (articleId: string, quantite: number) => Promise<void>;
  removeItem: (articleId: string) => Promise<void>;
  clearCartItems: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculer le nombre total d'articles
  const itemCount =
    cart?.articles?.reduce((sum, item) => sum + item.quantite, 0) || 0;

  // Calculer le total
  const total =
    cart?.articles?.reduce((sum, item) => {
      // Utiliser item.total si disponible, sinon calculer
      const itemTotal = item.total || item.quantite * item.prixUnitaire;
      return sum + itemTotal;
    }, 0) || 0;

  // Fonction pour récupérer le panier
  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCart();
      setCart(data.panier);
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
      // Ne pas afficher d'erreur si c'est juste un panier vide
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger le panier au montage
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Écouter les changements d'authentification pour recharger le panier après fusion
  useEffect(() => {
    const handleAuthChange = () => {
      console.log("🔄 Auth changed, refreshing cart after merge...");
      refreshCart();
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, [refreshCart]);

  // Ajouter un produit au panier
  const addToCart = async (produitId: string, quantite: number = 1) => {
    try {
      const response = await apiAddToCart(produitId, quantite);
      setCart(response.panier);
      toast.success(response.message || "Produit ajouté au panier");
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'ajout au panier",
      );
      throw error;
    }
  };

  // Modifier la quantité d'un article
  const updateQuantity = async (articleId: string, quantite: number) => {
    try {
      const response = await updateCartItem(articleId, quantite);
      setCart(response.panier);
      toast.success("Quantité mise à jour");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour",
      );
      throw error;
    }
  };

  // Supprimer un article
  const removeItem = async (articleId: string) => {
    try {
      const response = await removeFromCart(articleId);
      setCart(response.panier);
      toast.success("Produit retiré du panier");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression",
      );
      throw error;
    }
  };

  // Vider le panier
  const clearCartItems = async () => {
    try {
      await clearCart();
      setCart(null);
      toast.success("Panier vidé");
    } catch (error) {
      console.error("Erreur lors du vidage du panier:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors du vidage du panier",
      );
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemCount,
        total,
        addToCart,
        updateQuantity,
        removeItem,
        clearCartItems,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
