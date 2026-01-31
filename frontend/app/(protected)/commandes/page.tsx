"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedPageWrapper from "@/components/ProtectedPageWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  Search,
  Download,
  Truck,
  Clock,
  ShoppingBag,
  Leaf,
  LayoutGrid,
  List,
  Calendar,
  MapPin,
  X,
} from "lucide-react";
import {
  getCommandes,
  authErrorEvent,
  type Commande,
  updateCommandeStatus,
  cancelCommande,
} from "@/lib/api/commandes";
import { formatFCFA } from "@/lib/utils";
import { toast } from "sonner";

type Order = {
  id: string;
  orderNumber: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  status: "en-attente" | "confirmee" | "en-preparation" | "livree" | "annulee";
  totalAmount: number;
  deliveryDate: Date;
  itemsCount: number;
  deliveryMethod: "livraison" | "retrait";
  paymentStatus: "payee" | "en-attente" | "remboursee";
};

function OrdersPageContent() {
  const router = useRouter();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("tous");
  const [dateFilter, setDateFilter] = useState<string>("toutes");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [userRole, setUserRole] = useState<string>("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [cancelReason, setCancelReason] = useState<string>("");
  const [isCanceling, setIsCanceling] = useState(false);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    newStatus: string;
    orderNumber: string;
  } | null>(null);

  useEffect(() => {
    // Vérifier le rôle de l'utilisateur
    const authData = localStorage.getItem("clickmarket_auth");
    if (authData) {
      const { user } = JSON.parse(authData);
      setUserRole(user.role);
    }

    // Écouter les erreurs d'authentification
    const handleAuthError = () => {
      toast.error("Session expirée. Veuillez vous reconnecter.");
      router.push("/login");
    };

    authErrorEvent.addEventListener("authError", handleAuthError);

    loadCommandes();

    return () => {
      authErrorEvent.removeEventListener("authError", handleAuthError);
    };
  }, [router]);

  const loadCommandes = async () => {
    try {
      setLoading(true);
      const data = await getCommandes();
      setCommandes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
      toast.error(
        (error as Error).message || "Erreur lors du chargement des commandes",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Trouver la commande pour obtenir le numéro
    const order = orders.find((o) => o.id === orderId);
    const orderNumber = order?.orderNumber || orderId.slice(-8).toUpperCase();

    // Ouvrir le dialogue de confirmation
    setPendingStatusChange({ orderId, newStatus, orderNumber });
    setStatusChangeDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    try {
      // Convertir les tirets en underscores pour l'API
      const statusForApi = pendingStatusChange.newStatus.replace(/-/g, "_") as
        | "en_attente"
        | "confirmee"
        | "en_preparation"
        | "expediee"
        | "livree"
        | "annulee";

      await updateCommandeStatus(pendingStatusChange.orderId, statusForApi);
      toast.success("Statut de la commande mis à jour");
      await loadCommandes();
      setStatusChangeDialogOpen(false);
      setPendingStatusChange(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      setIsCanceling(true);
      await cancelCommande(selectedOrderId, cancelReason);
      toast.success("Commande annulée avec succès");
      setCancelDialogOpen(false);
      setSelectedOrderId("");
      setCancelReason("");
      await loadCommandes();
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      toast.error("Erreur lors de l'annulation de la commande");
    } finally {
      setIsCanceling(false);
    }
  };

  const openCancelDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCancelDialogOpen(true);
  };

  // Convertir les commandes Commande en Order pour les filtres
  const orders: Order[] = commandes.map((cmd) => {
    const statut = cmd.statutCommande || "en_attente";
    const statusWithDashes = statut.replace(/_/g, "-");

    return {
      id: cmd._id,
      orderNumber: cmd.numero || cmd._id.slice(-8).toUpperCase(),
      date: new Date(cmd.dateCommande),
      customerName: cmd.utilisateur
        ? `${cmd.utilisateur.prenom || ""} ${cmd.utilisateur.nom || ""}`.trim()
        : "Client inconnu",
      customerEmail: cmd.utilisateur?.email || "Email non disponible",
      status: statusWithDashes as Order["status"],
      totalAmount: cmd.montantTotal,
      deliveryDate: cmd.dateLivraison
        ? new Date(cmd.dateLivraison)
        : new Date(),
      itemsCount: cmd.articles.length,
      deliveryMethod: cmd.aLivrer ? "livraison" : "retrait",
      paymentStatus: cmd.paiement.statut as Order["paymentStatus"],
    };
  });

  const getStatusBadge = (status: Order["status"]) => {
    const config: Record<string, { label: string; color: string }> = {
      "en-attente": {
        label: "En attente",
        color:
          "text-amber-700 bg-amber-100 border-amber-300 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800",
      },
      confirmee: {
        label: "Confirmée",
        color:
          "text-blue-700 bg-blue-100 border-blue-300 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800",
      },
      "en-cours": {
        label: "En cours",
        color:
          "text-indigo-700 bg-indigo-100 border-indigo-300 dark:text-indigo-400 dark:bg-indigo-950 dark:border-indigo-800",
      },
      "en-preparation": {
        label: "En préparation",
        color:
          "text-purple-700 bg-purple-100 border-purple-300 dark:text-purple-400 dark:bg-purple-950 dark:border-purple-800",
      },
      expediee: {
        label: "Expédiée",
        color:
          "text-cyan-700 bg-cyan-100 border-cyan-300 dark:text-cyan-400 dark:bg-cyan-950 dark:border-cyan-800",
      },
      livree: {
        label: "Livrée",
        color:
          "text-green-700 bg-green-100 border-green-300 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
      },
      annulee: {
        label: "Annulée",
        color:
          "text-destructive bg-destructive/10 border-destructive/30 dark:bg-destructive/20",
      },
    };

    const statusConfig = config[status] || {
      label: status,
      color: "text-foreground bg-muted border-border",
    };

    return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>;
  };

  const getPaymentBadge = (status: Order["paymentStatus"]) => {
    const config: Record<string, { label: string; color: string }> = {
      en_attente: {
        label: "En attente",
        color:
          "text-amber-700 bg-amber-100 border-amber-300 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800",
      },
      en_cours: {
        label: "En cours",
        color:
          "text-blue-700 bg-blue-100 border-blue-300 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800",
      },
      reussi: {
        label: "Réussi",
        color:
          "text-green-700 bg-green-100 border-green-300 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
      },
      paye: {
        label: "Payée",
        color:
          "text-green-700 bg-green-100 border-green-300 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
      },
      echoue: {
        label: "Échoué",
        color:
          "text-destructive bg-destructive/10 border-destructive/30 dark:bg-destructive/20",
      },
      rembourse: {
        label: "Remboursée",
        color:
          "text-orange-700 bg-orange-100 border-orange-300 dark:text-orange-400 dark:bg-orange-950 dark:border-orange-800",
      },
      annule: {
        label: "Annulée",
        color: "text-foreground bg-muted border-border",
      },
    };

    const paymentConfig = config[status] || {
      label: status || "Inconnu",
      color: "text-foreground bg-muted border-border",
    };

    return (
      <Badge variant="outline" className={paymentConfig.color}>
        {paymentConfig.label}
      </Badge>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "tous" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "en-attente").length,
    inProgress: orders.filter((o) => o.status === "en-preparation").length,
    delivered: orders.filter((o) => o.status === "livree").length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="page-container-tight stack-6">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground">
            Gérez et suivez toutes les commandes de fruits et légumes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Exporter
          </Button>
          <Link href="/panier">
            <Button className="gap-2 bg-green-600 hover:bg-green-700">
              <ShoppingBag className="size-4" />
              Nouvelle commande
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total commandes
            </CardTitle>
            <ShoppingBag className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              À traiter aujourd&apos;hui
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En préparation
            </CardTitle>
            <Package className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Prêtes à être expédiées
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livrées</CardTitle>
            <Truck className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrer les commandes</CardTitle>
          <CardDescription>
            Recherchez et filtrez les commandes selon vos besoins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Numéro, client, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="tous">Tous les statuts</option>
                <option value="en-attente">En attente</option>
                <option value="confirmee">Confirmée</option>
                <option value="en-preparation">En préparation</option>
                <option value="livree">Livrée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Période</Label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="toutes">Toutes les périodes</option>
                <option value="aujourdhui">Aujourd&apos;hui</option>
                <option value="semaine">Cette semaine</option>
                <option value="mois">Ce mois</option>
                <option value="annee">Cette année</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des commandes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des commandes</CardTitle>
              <CardDescription className="mt-1.5">
                {filteredOrders.length} commande
                {filteredOrders.length > 1 ? "s" : ""} trouvée
                {filteredOrders.length > 1 ? "s" : ""}
              </CardDescription>
            </div>
            {/* Toggle vue */}
            <div className="flex items-center gap-2 rounded-lg border border-border p-1 bg-muted/30">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid" ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list" ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            /* Vue Grille (Cartes) */
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className="hover:shadow-md transition-shadow border-border"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Link
                          href={`/commandes/${order.id}`}
                          className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300 transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.date).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Client</span>
                        <span className="font-medium">
                          {order.customerName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Articles</span>
                        <span className="font-medium">{order.itemsCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Livraison</span>
                        <div className="flex items-center gap-1">
                          {order.deliveryMethod === "livraison" ? (
                            <Truck className="h-3 w-3 text-green-600" />
                          ) : (
                            <MapPin className="h-3 w-3 text-blue-600" />
                          )}
                          <span className="text-xs">
                            {order.deliveryMethod === "livraison"
                              ? "À livrer"
                              : "Retrait"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Statut de paiement
                        </span>
                        {getPaymentBadge(order.paymentStatus)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          Total
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {formatFCFA(order.totalAmount)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/commandes/${order.id}`}>Détails</Link>
                        </Button>
                        {userRole === "client" &&
                          order.status === "en-attente" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openCancelDialog(order.id)}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Annuler
                            </Button>
                          )}
                      </div>
                    </div>

                    {/* Actions Admin/Fournisseur */}
                    {(userRole === "admin" || userRole === "fournisseur") && (
                      <div className="pt-3 border-t border-border space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground">
                          Actions Admin
                        </Label>
                        <div className="space-y-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusChange(order.id, value)
                            }
                          >
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Modifier le statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en-attente">
                                En attente
                              </SelectItem>
                              <SelectItem value="confirmee">
                                Confirmée
                              </SelectItem>
                              <SelectItem value="en-preparation">
                                En préparation
                              </SelectItem>
                              <SelectItem value="expediee">Expédiée</SelectItem>
                              <SelectItem value="livree">Livrée</SelectItem>
                              <SelectItem value="annulee">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                          {/* <div className="flex gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex-1 h-9 text-xs"
                              onClick={() => openCancelDialog(order.id)}
                              disabled={
                                order.status === "annulee" ||
                                order.status === "livree"
                              }
                            >
                              <X className="h-3 w-3 mr-1" />
                              Annuler
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-9 text-xs"
                              onClick={() => {
                                handleStatusChange(order.id, "annulee");
                              }}
                              disabled={
                                order.status === "annulee" ||
                                order.status === "livree"
                              }
                            >
                              <Ban className="h-3 w-3 mr-1" />
                              Annuler
                            </Button>
                          </div> */}
                        </div>
                      </div>
                    )}

                    <div className="pt-2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Vue Liste (Tableau) */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">
                      N° Commande
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">
                      Client
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">
                      Date
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">
                      Statut
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">
                      Paiement
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">
                      Total
                    </th>
                    <th className="text-right py-4 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium">
                        <Link
                          href={`/commandes/${order.id}`}
                          className="text-green-600 hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300 transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="font-medium">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {new Date(order.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4 px-4">
                        {getPaymentBadge(order.paymentStatus)}
                      </td>
                      <td className="py-4 px-4 font-semibold text-green-600">
                        {formatFCFA(order.totalAmount)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(userRole === "admin" ||
                            userRole === "fournisseur") && (
                            <>
                              <Select
                                value={order.status}
                                onValueChange={(value) =>
                                  handleStatusChange(order.id, value)
                                }
                              >
                                <SelectTrigger className="h-8 w-36 text-xs">
                                  <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en-attente">
                                    En attente
                                  </SelectItem>
                                  <SelectItem value="confirmee">
                                    Confirmée
                                  </SelectItem>
                                  <SelectItem value="en-preparation">
                                    En préparation
                                  </SelectItem>
                                  <SelectItem value="expediee">
                                    Expédiée
                                  </SelectItem>
                                  <SelectItem value="livree">Livrée</SelectItem>
                                  <SelectItem value="annulee">
                                    Annulée
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openCancelDialog(order.id)}
                                disabled={
                                  order.status === "annulee" ||
                                  order.status === "livree"
                                }
                                className="h-8 text-xs"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          {userRole === "client" &&
                            order.status === "en-attente" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openCancelDialog(order.id)}
                                className="h-8 text-xs"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Annuler
                              </Button>
                            )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/commandes/${order.id}`}>Détails</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Onglets pour différentes vues */}
      <Tabs defaultValue="toutes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="toutes">Toutes les commandes</TabsTrigger>
          <TabsTrigger value="today">Aujourd&apos;hui</TabsTrigger>
          <TabsTrigger value="pending">À préparer</TabsTrigger>
          <TabsTrigger value="delivery">Livraisons</TabsTrigger>
        </TabsList>
        <TabsContent value="toutes" className="space-y-4">
          {/* Contenu du tableau principal déjà affiché */}
        </TabsContent>
      </Tabs>

      {/* Section aide rapide */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Leaf className="size-5" />
            Conseils pour la gestion des commandes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg p-4 bg-green-50/50 dark:bg-green-900/30 border border-border">
              <h4 className="font-semibold text-green-700 dark:text-green-400">
                🕒 Commandes urgentes
              </h4>
              <p className="mt-1 text-sm text-muted-foreground dark:text-green-300/70">
                Traitez les commandes du jour avant 11h pour une livraison le
                lendemain
              </p>
            </div>
            <div className="rounded-lg p-4 bg-green-50/50 dark:bg-green-900/30 border border-border">
              <h4 className="font-semibold text-green-700 dark:text-green-400">
                📦 Préparation
              </h4>
              <p className="mt-1 text-sm text-muted-foreground dark:text-green-300/70">
                Vérifiez la disponibilité des produits frais avant de confirmer
              </p>
            </div>
            <div className="rounded-lg p-4 bg-green-50/50 dark:bg-green-900/30 border border-border">
              <h4 className="font-semibold text-green-700 dark:text-green-400">
                🚚 Livraison
              </h4>
              <p className="mt-1 text-sm text-muted-foreground dark:text-green-300/70">
                Maintenir la chaîne du froid pour les produits frais et surgelés
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogue de confirmation d'annulation */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l&apos;annulation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette commande ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancel-reason">
                Raison de l&apos;annulation (optionnel)
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Indiquez la raison de l'annulation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-2 min-h-25"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setSelectedOrderId("");
                setCancelReason("");
              }}
              disabled={isCanceling}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCanceling}
              className="btn-destructive"
            >
              {isCanceling ? "Annulation..." : "Confirmer l'annulation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de changement de statut */}
      <Dialog
        open={statusChangeDialogOpen}
        onOpenChange={setStatusChangeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le changement de statut</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir modifier le statut de cette commande ?
            </DialogDescription>
          </DialogHeader>
          {pendingStatusChange && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-semibold">Commande :</span>{" "}
                    {pendingStatusChange.orderNumber}
                  </div>
                  <div>
                    <span className="font-semibold">Nouveau statut :</span>{" "}
                    <span className="capitalize">
                      {pendingStatusChange.newStatus === "en-attente" &&
                        "En attente"}
                      {pendingStatusChange.newStatus === "confirmee" &&
                        "Confirmée"}
                      {pendingStatusChange.newStatus === "en-preparation" &&
                        "En préparation"}
                      {pendingStatusChange.newStatus === "expediee" &&
                        "Expédiée"}
                      {pendingStatusChange.newStatus === "livree" && "Livrée"}
                      {pendingStatusChange.newStatus === "annulee" && "Annulée"}
                    </span>
                  </div>
                </div>
              </div>
              {pendingStatusChange.newStatus === "annulee" && (
                <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  ⚠️ L&apos;annulation d&apos;une commande est une action
                  importante qui peut affecter le client.
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setStatusChangeDialogOpen(false);
                setPendingStatusChange(null);
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmStatusChange}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmer le changement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedPageWrapper requiredRoles={["client", "fournisseur", "admin"]}>
      <OrdersPageContent />
    </ProtectedPageWrapper>
  );
}
