"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedPageWrapper from "@/components/ProtectedPageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  getProduits,
  deleteProduit,
  accepterProduit,
  refuserProduit,
  type Produit,
  type GetProduitsParams,
} from "@/lib/api/produits";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Package,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { authErrorEvent } from "@/lib/api/commandes";

function GestionProduitsPageContent() {
  const router = useRouter();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [produitToDelete, setProduitToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  // États pour accepter/refuser (admin)
  const [refuseDialogOpen, setRefuseDialogOpen] = useState(false);
  const [produitToRefuse, setProduitToRefuse] = useState<Produit | null>(null);
  const [raisonRefus, setRaisonRefus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [filters, setFilters] = useState<GetProduitsParams>({
    page: 1,
    limit: 20,
    search: "",
    category: "",
    sort: "newest",
    includeNonValides: true,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0,
  });

  // Vérifier le rôle utilisateur - fournisseur ou admin
  useEffect(() => {
    const authData = localStorage.getItem("clickmarket_auth");
    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        setUserRole(user?.role || "");
        if (user?.role !== "fournisseur" && user?.role !== "admin") {
          toast.error(
            "Accès refusé. Cette page est réservée aux fournisseurs et administrateurs.",
          );
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

  // Listener pour les erreurs d'authentification
  useEffect(() => {
    const handleAuthError = () => {
      toast.error("Session expirée, veuillez vous reconnecter");
      router.push("/login");
    };

    authErrorEvent.addEventListener("authError", handleAuthError);

    return () => {
      authErrorEvent.removeEventListener("authError", handleAuthError);
    };
  }, [router]);

  // Charger les produits
  const loadProduits = async () => {
    try {
      setIsLoading(true);
      const response = await getProduits(filters);
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
    if (userRole === "fournisseur" || userRole === "admin") {
      loadProduits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, userRole]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      category: value === "all" ? "" : value,
      page: 1,
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sort: value as GetProduitsParams["sort"],
      page: 1,
    }));
  };

  const confirmDelete = (id: string) => {
    setProduitToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!produitToDelete) return;

    try {
      setIsDeleting(true);
      await deleteProduit(produitToDelete);
      toast.success("Produit supprimé avec succès");
      setDeleteDialogOpen(false);
      setProduitToDelete(null);
      loadProduits();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(
        (error as Error).message || "Erreur lors de la suppression du produit",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/produits/modifier/${id}`);
  };

  // Fonctions pour accepter/refuser (Admin uniquement)
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
          <h1 className="text-3xl font-bold">Gestion des produits</h1>
          <p className="text-muted-foreground mt-2">
            Gérez votre catalogue de produits
          </p>
        </div>
        <Button
          onClick={() => router.push("/produits/nouveau")}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau produit
        </Button>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Catégorie */}
            <Select
              value={filters.category || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="legumes">Légumes</SelectItem>
              </SelectContent>
            </Select>

            {/* Tri */}
            <Select
              value={filters.sort || "newest"}
              onValueChange={handleSortChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récents</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="popular">Plus populaires</SelectItem>
                <SelectItem value="rating">Mieux notés</SelectItem>
              </SelectContent>
            </Select>
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
                Aucun produit trouvé
              </h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter votre premier produit
              </p>
              <Button
                onClick={() => router.push("/produits/nouveau")}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {produits.map((produit) => (
              <Card key={produit._id} className="overflow-hidden">
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
                  {produit.stock === 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive">Rupture</Badge>
                    </div>
                  )}
                  {produit.stock > 0 && produit.stock < 10 && (
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="outline"
                        className="bg-orange-100 text-orange-800 border-orange-300"
                      >
                        Stock faible
                      </Badge>
                    </div>
                  )}
                  {/* Badge de statut validation */}
                  {produit.statutValidation && (
                    <div className="absolute top-2 left-2">
                      {produit.statutValidation === "en_attente" && (
                        <Badge className="bg-amber-500">En attente</Badge>
                      )}
                      {produit.statutValidation === "accepte" && (
                        <Badge className="bg-green-600">Accepté</Badge>
                      )}
                      {produit.statutValidation === "refuse" && (
                        <Badge variant="destructive">Refusé</Badge>
                      )}
                    </div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">
                        {produit.nomProduit}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {produit.description}
                      </CardDescription>
                    </div>
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

                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prix</span>
                      <span className="font-semibold">
                        {produit.prix.toLocaleString()} FCFA
                        {produit.uniteVente && ` / ${produit.uniteVente.nom}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
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
                  </div>

                  <div className="flex gap-2">
                    {userRole === "admin" ? (
                      <>
                        {/* Boutons pour admin */}
                        {produit.statutValidation !== "accepte" && (
                          <Button
                            variant="default"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleAccepter(produit._id)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              "Accepter"
                            )}
                          </Button>
                        )}
                        {produit.statutValidation !== "refuse" && (
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => openRefuseDialog(produit)}
                            disabled={isProcessing}
                          >
                            Refuser
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(produit._id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {/* Boutons pour fournisseur */}
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEdit(produit._id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => confirmDelete(produit._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est
              irréversible et supprimera également toutes les images associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn-destructive"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de refus de produit (Admin) */}
      <AlertDialog open={refuseDialogOpen} onOpenChange={setRefuseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Refuser le produit
            </AlertDialogTitle>
            <AlertDialogDescription>
              {produitToRefuse && (
                <span>
                  Vous êtes sur le point de refuser le produit{" "}
                  <strong>{produitToRefuse.nomProduit}</strong>. Veuillez
                  indiquer la raison du refus.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Raison du refus (obligatoire)..."
              value={raisonRefus}
              onChange={(e) => setRaisonRefus(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRefuser}
              disabled={isProcessing || !raisonRefus.trim()}
              className="btn-destructive"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refus en cours...
                </>
              ) : (
                "Refuser le produit"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function GestionProduitsPage() {
  return (
    <ProtectedPageWrapper requiredRoles={["fournisseur", "admin"]}>
      <GestionProduitsPageContent />
    </ProtectedPageWrapper>
  );
}
