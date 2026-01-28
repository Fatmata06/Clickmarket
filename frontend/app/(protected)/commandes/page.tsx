"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import {
  Package,
  Search,
  Download,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingBag,
  Leaf,
} from "lucide-react";

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

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "CMD-2024-001",
    date: new Date(2024, 2, 15),
    customerName: "Marie Dubois",
    customerEmail: "marie.dubois@email.com",
    status: "livree",
    totalAmount: 89.5,
    deliveryDate: new Date(2024, 2, 16),
    itemsCount: 8,
    deliveryMethod: "livraison",
    paymentStatus: "payee",
  },
  {
    id: "2",
    orderNumber: "CMD-2024-002",
    date: new Date(2024, 2, 16),
    customerName: "Paul Martin",
    customerEmail: "paul.martin@email.com",
    status: "en-preparation",
    totalAmount: 124.75,
    deliveryDate: new Date(2024, 2, 17),
    itemsCount: 12,
    deliveryMethod: "retrait",
    paymentStatus: "payee",
  },
  {
    id: "3",
    orderNumber: "CMD-2024-003",
    date: new Date(2024, 2, 16),
    customerName: "Sophie Laurent",
    customerEmail: "sophie.laurent@email.com",
    status: "confirmee",
    totalAmount: 45.9,
    deliveryDate: new Date(2024, 2, 18),
    itemsCount: 5,
    deliveryMethod: "livraison",
    paymentStatus: "en-attente",
  },
  {
    id: "4",
    orderNumber: "CMD-2024-004",
    date: new Date(2024, 2, 14),
    customerName: "Jean Petit",
    customerEmail: "jean.petit@email.com",
    status: "annulee",
    totalAmount: 67.3,
    deliveryDate: new Date(2024, 2, 15),
    itemsCount: 7,
    deliveryMethod: "livraison",
    paymentStatus: "remboursee",
  },
  {
    id: "5",
    orderNumber: "CMD-2024-005",
    date: new Date(2024, 2, 17),
    customerName: "Claire Bernard",
    customerEmail: "claire.bernard@email.com",
    status: "en-attente",
    totalAmount: 112.4,
    deliveryDate: new Date(2024, 2, 19),
    itemsCount: 10,
    deliveryMethod: "retrait",
    paymentStatus: "en-attente",
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("tous");
  const [dateFilter, setDateFilter] = useState<string>("toutes");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const getStatusBadge = (status: Order["status"]) => {
    const config = {
      "en-attente": {
        label: "En attente",
        variant: "outline",
        icon: Clock,
        color: "text-amber-600 bg-amber-50 border-amber-200",
      },
      confirmee: {
        label: "Confirmée",
        variant: "secondary",
        icon: CheckCircle,
        color: "text-blue-600 bg-blue-50 border-blue-200",
      },
      "en-preparation": {
        label: "En préparation",
        variant: "default",
        icon: Package,
        color: "text-purple-600 bg-purple-50 border-purple-200",
      },
      livree: {
        label: "Livrée",
        variant: "success",
        icon: Truck,
        color: "text-green-600 bg-green-50 border-green-200",
      },
      annulee: {
        label: "Annulée",
        variant: "destructive",
        icon: AlertCircle,
        color: "text-red-600 bg-red-50 border-red-200",
      },
    };

    const { label, color } = config[status];
    return <Badge className={color}>{label}</Badge>;
  };

  const getPaymentBadge = (status: Order["paymentStatus"]) => {
    const config = {
      payee: {
        label: "Payée",
        color: "text-green-600 bg-green-50 border-green-200",
      },
      "en-attente": {
        label: "En attente",
        color: "text-amber-600 bg-amber-50 border-amber-200",
      },
      remboursee: {
        label: "Remboursée",
        color: "text-red-600 bg-red-50 border-red-200",
      },
    };

    const { label, color } = config[status];
    return (
      <Badge variant="outline" className={color}>
        {label}
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Leaf className="mx-auto size-12 animate-pulse text-green-600" />
          <p className="mt-4 text-muted-foreground">
            Chargement des commandes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
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
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            <ShoppingBag className="size-4" />
            Nouvelle commande
          </Button>
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
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
          <CardTitle>Liste des commandes</CardTitle>
          <CardDescription>
            {filteredOrders.length} commande
            {filteredOrders.length > 1 ? "s" : ""} trouvée
            {filteredOrders.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">
                    N° Commande
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Client</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Paiement
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Total</th>
                  <th className="text-right py-3 px-4 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">
                      <Link
                        href={`/commandes/${order.id}`}
                        className="text-green-600 hover:text-green-800 hover:underline dark:text-green-400"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(order.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 px-4">
                      {getPaymentBadge(order.paymentStatus)}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {order.totalAmount.toFixed(2)} €
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/commandes/${order.id}`}>Détails</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
            <Leaf className="size-5" />
            Conseils pour la gestion des commandes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 dark:bg-green-900/50">
              <h4 className="font-semibold text-green-700 dark:text-green-300">
                🕒 Commandes urgentes
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Traitez les commandes du jour avant 11h pour une livraison le
                lendemain
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 dark:bg-green-900/50">
              <h4 className="font-semibold text-green-700 dark:text-green-300">
                📦 Préparation
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Vérifiez la disponibilité des produits frais avant de confirmer
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 dark:bg-green-900/50">
              <h4 className="font-semibold text-green-700 dark:text-green-300">
                🚚 Livraison
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Maintenir la chaîne du froid pour les produits frais et surgelés
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
