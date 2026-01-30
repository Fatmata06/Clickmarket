"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Truck, MapPin, Loader2 } from "lucide-react";
import { getZonesLivraison, ZoneLivraison } from "@/lib/api/zones";
import { toast } from "sonner";

interface DeliveryMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: {
    methodeLivraison: "livraison" | "retrait";
    adresseLivraison?: string;
    zoneLivraison?: string;
  }) => void;
  isLoading?: boolean;
}

export function DeliveryMethodDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeliveryMethodDialogProps) {
  const [deliveryMethod, setDeliveryMethod] = useState<"livraison" | "retrait">(
    "livraison",
  );
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState("");
  const [zones, setZones] = useState<ZoneLivraison[]>([]);
  const [loadingZones, setLoadingZones] = useState(true);

  // Charger les zones au montage
  useEffect(() => {
    if (open && deliveryMethod === "livraison") {
      loadZones();
    }
  }, [open, deliveryMethod]);

  const loadZones = async () => {
    try {
      setLoadingZones(true);
      const data = await getZonesLivraison();
      setZones(data);
      // Sélectionner la première zone par défaut
      if (data.length > 0) {
        setZone(data[0]._id);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des zones:", error);
      toast.error("Erreur lors du chargement des zones de livraison");
    } finally {
      setLoadingZones(false);
    }
  };

  const handleConfirm = () => {
    // Valider les champs nécessaires
    if (deliveryMethod === "livraison") {
      if (!address.trim()) {
        toast.error("Veuillez entrer une adresse de livraison");
        return;
      }
      if (!zone) {
        toast.error("Veuillez sélectionner une zone de livraison");
        return;
      }
    }

    onConfirm({
      methodeLivraison: deliveryMethod,
      adresseLivraison: deliveryMethod === "livraison" ? address : undefined,
      zoneLivraison: deliveryMethod === "livraison" ? zone : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Méthode de livraison</DialogTitle>
          <DialogDescription>
            Comment souhaitez-vous recevoir votre commande ?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup
            value={deliveryMethod}
            onValueChange={(value: string) =>
              setDeliveryMethod(value as "livraison" | "retrait")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="livraison" id="livraison" />
              <Label
                htmlFor="livraison"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Truck className="h-4 w-4" />À livrer
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="retrait" id="retrait" />
              <Label
                htmlFor="retrait"
                className="flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="h-4 w-4" />
                Retrait sur place
              </Label>
            </div>
          </RadioGroup>

          {/* Champs pour la livraison */}
          {deliveryMethod === "livraison" && (
            <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <Label htmlFor="address">Adresse de livraison *</Label>
                <Input
                  id="address"
                  placeholder="Entrez votre adresse complète"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="zone">Zone de livraison *</Label>
                {loadingZones ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Chargement des zones...
                  </div>
                ) : (
                  <Select
                    value={zone}
                    onValueChange={setZone}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="zone">
                      <SelectValue placeholder="Sélectionnez une zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((z) => (
                        <SelectItem key={z._id} value={z._id}>
                          {z.nom} ({z.prix} FCFA)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création...
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
