"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedPageWrapper from "@/components/ProtectedPageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getProduitsEnAttente,
  accepterProduit,
  refuserProduit,
  type Produit,
  type GetProduitsParams,
} from "@/lib/api/produits";
import {
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

function ProduitsValidationPageContent() {
  const router = useRouter();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  // États pour refuser
  const [refuseDialogOpen, setRefuseDialogOpen] = useState(false);
  const [produitToRefuse, setProduitToRefuse] = useState<Produit | null>(null);
  const [raisonRefus, setRaisonRefus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [filters, setFilters] = useState<GetProduitsParams>({
    page: 1,
    limit: 20,
    search: "",
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0,
  });

  // Vérifier le rôle utilisateur (admin uniquement)
  useEffect(() => {
    const authData = localStorage.getItem("clickmarket_auth");
    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        setUserRole(user?.role || "");
        if (user?.role !== "admin") {
          toast.error("Accès refusé. Cette page est réservée aux admins.");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la lecture des données utilisateur:",
          error,
        );
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  // Charger les produits en attente
  const loadProduits = async () => {
    try {
      setIsLoading(true);
      const response = await getProduitsEnAttente(filters);
      setProduits(response.products);
      setPagination({
        total: response.total,
        page: response.page,
        pages: response.pages,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "admin") {
      loadProduits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, userRole]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  // Fonctions pour accepter/refuser
  const handleAccepter = async (produitId: string) => {
    try {
      setIsProcessing(true);
      await accepterProduit(produitId);
      toast.success("Produit accepté avec succès");
      loadProduits();
    } catch (error) {
      console.error("Erreur lors de l'acceptation:", error);
      toast.error(
        (error as Error).message || "Erreur lors de l'acceptation du produit",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const openRefuseDialog = (produit: Produit) => {
    setProduitToRefuse(produit);
    setRaisonRefus("");
    setRefuseDialogOpen(true);
  };

  const handleRefuser = async () => {
    if (!produitToRefuse || !raisonRefus.trim()) {
      toast.error("Veuillez indiquer une raison de refus");
      return;
    }

    try {
      setIsProcessing(true);
      await refuserProduit(produitToRefuse._id, raisonRefus);
      toast.success("Produit refusé avec succès");
      setRefuseDialogOpen(false);
      setProduitToRefuse(null);
      setRaisonRefus("");
      loadProduits();
    } catch (error) {
      console.error("Erreur lors du refus:", error);
      toast.error(
        (error as Error).message || "Erreur lors du refus du produit",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading && produits.length === 0) {
    return (
      <div className="page-container-md">
        <div className="flex items-center justify-center min-h-100">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Validation des produits</h1>
          <p className="text-muted-foreground mt-2">
            Examinez et validez les nouveaux produits en attente
          </p>
        </div>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des produits */}
      {produits.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aucun produit en attente
              </h3>
              <p className="text-muted-foreground">
                Tous les produits ont été validés
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {produits.map((produit) => (
              <Card key={produit._id} className="overflow-hidden flex flex-col">
                <div className="relative aspect-square">
                  {produit.images && produit.images.length > 0 ? (
                    <Image
                      src={produit.images[0].url}
                      alt={produit.nomProduit}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-amber-500">
                    En attente
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <div>
                    <CardTitle className="line-clamp-1">
                      {produit.nomProduit}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {produit.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{produit.typeProduit}</Badge>
                    {produit.tags &&
                      produit.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="space-y-2 mb-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix</span>
                      <span className="font-semibold">
                        {produit.prix.toLocaleString()} FCFA
                        {produit.uniteVente && ` / ${produit.uniteVente.nom}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stock</span>
                      <span
                        className={
                          produit.stock === 0
                            ? "text-red-600 font-semibold"
                            : produit.stock < 10
                              ? "text-orange-600 font-semibold"
                              : "font-semibold"
                        }
                      >
                        {produit.stock} {produit.uniteVente?.nom || "unité(s)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fournisseur</span>
                      <span className="font-semibold text-sm">
                        {typeof produit.fournisseur === "string"
                          ? produit.fournisseur
                          : produit.fournisseur?.nomEntreprise}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border mt-auto">
                    <Button
                      variant="default"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAccepter(produit._id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      Accepter
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => openRefuseDialog(produit)}
                      disabled={isProcessing}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Refuser
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page! - 1),
                  }))
                }
              >
                Précédent
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} sur {pagination.pages}
                </span>
              </div>
              <Button
                variant="outline"
                disabled={pagination.page === pagination.pages}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.min(pagination.pages, prev.page! + 1),
                  }))
                }
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}

      {/* Dialog de refus */}
      <AlertDialog open={refuseDialogOpen} onOpenChange={setRefuseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Refuser le produit
            </AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez indiquer une raison de refus pour le fournisseur
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <Textarea
              placeholder="Raison du refus (qualité insuffisante, prix non conforme, etc.)"
              value={raisonRefus}
              onChange={(e) => setRaisonRefus(e.target.value)}
              className="min-h-24"
            />
          </div>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel disabled={isProcessing}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRefuser}
              disabled={isProcessing || !raisonRefus.trim()}
              className="btn-destructive"
            >
              {isProcessing ? "Refus en cours..." : "Refuser le produit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ProduitsValidationPage() {
  return (
    <ProtectedPageWrapper requiredRoles={["admin"]}>
      <ProduitsValidationPageContent />
    </ProtectedPageWrapper>
  );
}
