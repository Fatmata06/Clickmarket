"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Breadcrumb from "@/components/breadcrumb";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  User,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  getCommande,
  cancelCommande,
  type Commande,
} from "@/lib/api/commandes";
import { toast } from "sonner";

export default function CommandeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const commandeId = params.id as string;

  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    loadCommande();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandeId]);

  const loadCommande = async () => {
    try {
      setLoading(true);
      const data = await getCommande(commandeId);
      setCommande(data);
    } catch (error) {
      console.error("Erreur lors du chargement de la commande:", error);
      toast.error(
        (error as Error).message || "Erreur lors du chargement de la commande",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCommande = async () => {
    if (!commande) return;

    if (!confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      return;
    }

    try {
      setCanceling(true);
      await cancelCommande(commande._id);
      toast.success("Commande annulée avec succès");
      router.push("/commandes");
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      toast.error(
        (error as Error).message ||
          "Erreur lors de l'annulation de la commande",
      );
    } finally {
      setCanceling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        label: string;
        variant: string;
        icon: React.ComponentType<{ className?: string }>;
      }
    > = {
      en_attente: {
        label: "En attente",
        variant:
          "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800",
        icon: Clock,
      },
      confirmee: {
        label: "Confirmée",
        variant:
          "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
        icon: CheckCircle,
      },
      en_preparation: {
        label: "En préparation",
        variant:
          "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
        icon: Package,
      },
      en_livraison: {
        label: "En livraison",
        variant:
          "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800",
        icon: Truck,
      },
      livree: {
        label: "Livrée",
        variant:
          "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
        icon: CheckCircle,
      },
      annulee: {
        label: "Annulée",
        variant:
          "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
        icon: XCircle,
      },
    };

    const config = statusMap[status] || statusMap.en_attente;
    const Icon = config.icon;

    return (
      <Badge
        className={`${config.variant} border flex items-center gap-1.5 px-3 py-1.5 w-fit`}
      >
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: string }> = {
      en_attente: {
        label: "En attente",
        variant:
          "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
      },
      paye: {
        label: "Payé",
        variant:
          "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
      },
      echoue: {
        label: "Échoué",
        variant:
          "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
      },
    };

    const config = statusMap[status] || statusMap.en_attente;

    return (
      <Badge className={`${config.variant} border px-3 py-1.5 w-fit`}>
        {config.label}
      </Badge>
    );
  };

  const breadcrumbItems = [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Commandes", href: "/commandes" },
    { label: commande?.numero || "Détails", href: `/commandes/${commandeId}` },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Commande introuvable</p>
            <p className="text-sm text-muted-foreground mb-4">
              La commande que vous recherchez n&apos;existe pas ou a été
              supprimée.
            </p>
            <Button asChild>
              <Link href="/commandes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux commandes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canCancel =
    commande.statut === "en_attente" || commande.statut === "confirmee";

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/commandes">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Commande {commande.numero}</h1>
              <p className="text-sm text-muted-foreground">
                Passée le{" "}
                {new Date(commande.dateCommande).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(commande.statut)}
          {canCancel && (
            <Button
              variant="destructive"
              onClick={handleCancelCommande}
              disabled={canceling}
            >
              {canceling ? "Annulation..." : "Annuler la commande"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles commandés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Articles commandés
              </CardTitle>
              <CardDescription>
                {commande.articles.length} article
                {commande.articles.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commande.articles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {article.produit.images && article.produit.images[0] ? (
                        <Image
                          src={article.produit.images[0]}
                          alt={article.produit.nom}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/produits/${article.produit._id}`}
                        className="font-medium hover:text-green-600 transition-colors line-clamp-2"
                      >
                        {article.produit.nom}
                      </Link>
                      {article.produit.fournisseur && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Vendu par {article.produit.fournisseur.nom}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          Quantité:{" "}
                          <span className="font-medium text-foreground">
                            {article.quantite}
                          </span>
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          Prix unitaire:{" "}
                          <span className="font-medium text-foreground">
                            {article.prixUnitaire.toFixed(2)} €
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {article.total.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Adresse de livraison */}
          {commande.adresseLivraison && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{commande.adresseLivraison.rue}</p>
                  <p>
                    {commande.adresseLivraison.codePostal}{" "}
                    {commande.adresseLivraison.ville}
                  </p>
                  {commande.adresseLivraison.pays && (
                    <p className="text-muted-foreground">
                      {commande.adresseLivraison.pays}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Résumé financier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Résumé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-medium">
                    {(commande.montantTotal - commande.fraisLivraison).toFixed(
                      2,
                    )}{" "}
                    €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Frais de livraison
                  </span>
                  <span className="font-medium">
                    {commande.fraisLivraison > 0
                      ? `${commande.fraisLivraison.toFixed(2)} €`
                      : "Gratuit"}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      {commande.montantTotal.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Statut du paiement
                    </span>
                    {getPaymentBadge(commande.statutPaiement)}
                  </div>
                  {commande.methodePaiement && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Méthode</span>
                      <span className="font-medium capitalize">
                        {commande.methodePaiement}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">
                    {commande.utilisateur.prenom} {commande.utilisateur.nom}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">
                  {commande.utilisateur.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informations livraison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                Livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Mode</span>
                <Badge variant="outline" className="capitalize">
                  {commande.methodeLivraison === "livraison"
                    ? "Livraison"
                    : "Retrait"}
                </Badge>
              </div>
              {commande.zoneLivraison && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Zone</span>
                  <span className="font-medium">
                    {commande.zoneLivraison.nom}
                  </span>
                </div>
              )}
              {commande.dateLivraison && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date prévue</span>
                  <span className="font-medium">
                    {new Date(commande.dateLivraison).toLocaleDateString(
                      "fr-FR",
                    )}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
