"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  Minus,
  Plus,
  Loader2,
  Package,
  Truck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createCommande } from "@/lib/api/commandes";
import { getZonesLivraison, type ZoneLivraison } from "@/lib/api/zones";
import { toast } from "sonner";

export default function CartSheet() {
  const {
    cart,
    isLoading,
    itemCount,
    total,
    updateQuantity,
    removeItem,
    clearCartItems,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<"livraison" | "retrait">(
    "livraison",
  );
  const [zones, setZones] = useState<ZoneLivraison[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("");

  const cartItems = cart?.articles || [];
  const subtotal = total;

  // Calculer les frais de livraison
  const deliveryFee =
    deliveryMode === "livraison" && selectedZone
      ? zones.find((z) => z._id === selectedZone)?.prix || 0
      : 0;

  const totalWithDelivery = subtotal + deliveryFee;

  // Charger les zones de livraison
  useEffect(() => {
    const loadZones = async () => {
      try {
        const data = await getZonesLivraison();
        setZones(data);
      } catch (error) {
        console.error("Erreur chargement zones:", error);
      }
    };
    loadZones();
  }, []);

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

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    // Validation pour la livraison
    if (deliveryMode === "livraison") {
      if (!selectedZone) {
        toast.error("Veuillez sélectionner une zone de livraison");
        return;
      }
    }

    try {
      setIsCreatingOrder(true);
      const commandeData: {
        methodeLivraison: "livraison" | "retrait";
        aLivrer: boolean;
        adresseLivraison?: string;
        zoneLivraison?: string;
      } = {
        methodeLivraison: deliveryMode,
        aLivrer: deliveryMode === "livraison",
      };

      if (deliveryMode === "livraison") {
        const selectedZoneData = zones.find((z) => z._id === selectedZone);
        commandeData.adresseLivraison = selectedZoneData?.nom || "À préciser";
        commandeData.zoneLivraison = selectedZone;
      }

      const newCommande = await createCommande(commandeData);
      toast.success("Commande créée avec succès !");
      setShowCheckoutDialog(false);
      setSheetOpen(false);

      // Réinitialiser le formulaire
      setDeliveryMode("retrait");
      setSelectedZone("");

      router.push(`/commandes/${newCommande._id}`);
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      toast.error(
        (error as Error).message || "Erreur lors de la création de la commande",
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:text-black hover:dark:hover:text-white hover:bg-green-500 dark:hover:bg-green-900"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:h-100 flex flex-col">
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Ne pas afficher le panier pour les admins et fournisseurs
  if (user?.role === "admin" || user?.role === "fournisseur") {
    return null;
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
      <SheetContent side="right" className="w-full h-full flex flex-col">
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
                    {item.prixUnitaire.toLocaleString()} FCFA / kg
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
                    <span className="text-xs font-medium min-w-10 text-center">
                      {item.quantite} kg
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
                    {item.total.toLocaleString()} FCFA
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
                <span className="font-semibold">
                  {subtotal.toLocaleString()} FCFA
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t text-base font-bold">
                <span>Total</span>
                <span className="text-green-600">
                  {subtotal.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full text-white bg-green-600 hover:bg-green-700"
                onClick={() => setShowCheckoutDialog(true)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Commander
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={async () => {
                    await clearCartItems();
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider le panier
                </Button>

                <SheetClose asChild>
                  <Button
                    className="flex-1 text-white bg-green-600 hover:bg-green-700"
                    asChild
                  >
                    <Link href="/panier">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Voir le panier
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </div>
        )}
      </SheetContent>

      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une commande</DialogTitle>
            <DialogDescription>
              Choisissez votre mode de récupération et complétez les
              informations nécessaires
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Mode de livraison */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Mode de récupération
              </Label>
              <RadioGroup
                value={deliveryMode}
                onValueChange={(value: string) =>
                  setDeliveryMode(value as "livraison" | "retrait")
                }
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="retrait"
                    id="retrait"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="retrait"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-600 [&:has([data-state=checked])]:border-green-600 cursor-pointer"
                  >
                    <Package className="mb-3 h-6 w-6" />
                    <span className="font-medium">Retrait</span>
                    <span className="text-xs text-muted-foreground text-center mt-2">
                      Récupérez votre commande en magasin
                    </span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="livraison"
                    id="livraison"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="livraison"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-600 [&:has([data-state=checked])]:border-green-600 cursor-pointer"
                  >
                    <Truck className="mb-3 h-6 w-6" />
                    <span className="font-medium">Livraison</span>
                    <span className="text-xs text-muted-foreground text-center mt-2">
                      Livraison à domicile
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Formulaire de livraison */}
            {deliveryMode === "livraison" && (
              <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                <h3 className="font-semibold">Zone de livraison</h3>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez votre zone de livraison. Vous pourrez préciser
                  votre adresse complète après validation de la commande.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="zone">Zone de livraison</Label>
                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone._id} value={zone._id}>
                          {zone.nom} - {zone.prix.toLocaleString()} FCFA
                          {zone.delaiLivraison && ` (${zone.delaiLivraison})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Récapitulatif */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">
                  {subtotal.toLocaleString()} FCFA
                </span>
              </div>
              {deliveryMode === "livraison" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Frais de livraison
                  </span>
                  <span className="font-medium">
                    {selectedZone
                      ? `${deliveryFee.toLocaleString()} FCFA`
                      : "—"}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-green-600">
                  {totalWithDelivery.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCheckoutDialog(false)}
              disabled={isCreatingOrder}
            >
              Annuler
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleCreateOrder}
              disabled={isCreatingOrder}
            >
              {isCreatingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer la commande"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
