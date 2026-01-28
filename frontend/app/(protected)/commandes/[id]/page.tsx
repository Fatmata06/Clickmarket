"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
  Mail,
  MapPin,
  Package,
  Phone,
  Printer,
  Share2,
  Truck,
  User,
  AlertCircle,
  Leaf,
  Calendar,
  Apple,
  Carrot,
  Salad,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  category: "fruits" | "legumes" | "herbes" | "autres";
  quantity: number;
  unitPrice: number;
  total: number;
  unit: string;
  image?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  status: "en-attente" | "confirmee" | "en-preparation" | "livree" | "annulee";
  totalAmount: number;
  deliveryDate: Date;
  itemsCount: number;
  deliveryMethod: "livraison" | "retrait";
  paymentStatus: "payee" | "en-attente" | "remboursee";
  paymentMethod: "carte" | "virement" | "especes";
  notes: string;
  items: OrderItem[];
  deliveryAddress?: string;
  deliveryInstructions?: string;
};

const mockOrder: Order = {
  id: "1",
  orderNumber: "CMD-2024-001",
  date: new Date(2024, 2, 15, 14, 30),
  customerName: "Marie Dubois",
  customerEmail: "marie.dubois@email.com",
  customerPhone: "+33 6 12 34 56 78",
  customerAddress: "123 Rue de la République, 75001 Paris",
  status: "livree",
  totalAmount: 89.5,
  deliveryDate: new Date(2024, 2, 16, 10, 0),
  itemsCount: 8,
  deliveryMethod: "livraison",
  paymentStatus: "payee",
  paymentMethod: "carte",
  notes: "Livrer avant midi si possible. Sonner au portail.",
  deliveryAddress: "123 Rue de la République, 75001 Paris",
  deliveryInstructions: "Appeler 10 min avant arrivée. Interphone: 1234",
  items: [
    {
      id: "1",
      name: "Pommes Golden Bio",
      category: "fruits",
      quantity: 2,
      unitPrice: 3.5,
      total: 7.0,
      unit: "kg",
    },
    {
      id: "2",
      name: "Carottes nouvelles",
      category: "legumes",
      quantity: 1.5,
      unitPrice: 2.8,
      total: 4.2,
      unit: "kg",
    },
    {
      id: "3",
      name: "Salade Batavia",
      category: "legumes",
      quantity: 3,
      unitPrice: 1.8,
      total: 5.4,
      unit: "pièce",
    },
    {
      id: "4",
      name: "Fraises Gariguettes",
      category: "fruits",
      quantity: 4,
      unitPrice: 5.9,
      total: 23.6,
      unit: "barquette",
    },
    {
      id: "5",
      name: "Persil frais",
      category: "herbes",
      quantity: 2,
      unitPrice: 1.2,
      total: 2.4,
      unit: "bouquet",
    },
    {
      id: "6",
      name: "Tomates anciennes",
      category: "legumes",
      quantity: 1.2,
      unitPrice: 6.5,
      total: 7.8,
      unit: "kg",
    },
    {
      id: "7",
      name: "Bananes Bio",
      category: "fruits",
      quantity: 1.8,
      unitPrice: 2.9,
      total: 5.22,
      unit: "kg",
    },
    {
      id: "8",
      name: "Oignons rouges",
      category: "legumes",
      quantity: 1,
      unitPrice: 3.5,
      total: 3.5,
      unit: "kg",
    },
  ],
};

export default function OrderDetailsPage() {
  // const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const toDate = (value: Date | string) =>
    value instanceof Date ? value : new Date(value);

  const formatDateShort = (value: Date | string) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(toDate(value));

  const formatWeekdayDate = (value: Date | string) =>
    new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    }).format(toDate(value));

  const formatDateTimeLong = (value: Date | string) => {
    const date = toDate(value);
    const datePart = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
    const timePart = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
    return `${datePart} à ${timePart}`;
  };

  const formatDateTimeShort = (value: Date | string) => {
    const date = toDate(value);
    const datePart = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
    const timePart = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
    return `${datePart} à ${timePart}`;
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    // Simulation de chargement des données
    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 500);
  }, [user, isLoading, router]);

  const getStatusConfig = (status: Order["status"]) => {
    const config = {
      "en-attente": {
        label: "En attente",
        icon: Clock,
        color: "bg-amber-100 text-amber-800 border-amber-200",
        buttonColor: "bg-amber-600 hover:bg-amber-700",
      },
      confirmee: {
        label: "Confirmée",
        icon: CheckCircle,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
      },
      "en-preparation": {
        label: "En préparation",
        icon: Package,
        color: "bg-purple-100 text-purple-800 border-purple-200",
        buttonColor: "bg-purple-600 hover:bg-purple-700",
      },
      livree: {
        label: "Livrée",
        icon: Truck,
        color: "bg-green-100 text-green-800 border-green-200",
        buttonColor: "bg-green-600 hover:bg-green-700",
      },
      annulee: {
        label: "Annulée",
        icon: AlertCircle,
        color: "bg-red-100 text-red-800 border-red-200",
        buttonColor: "bg-red-600 hover:bg-red-700",
      },
    };
    return config[status];
  };

  const getCategoryIcon = (category: OrderItem["category"]) => {
    switch (category) {
      case "fruits":
        return <Apple className="size-4 text-red-500" />;
      case "legumes":
        return <Carrot className="size-4 text-orange-500" />;
      case "herbes":
        return <Leaf className="size-4 text-green-500" />;
      default:
        return <Salad className="size-4 text-emerald-500" />;
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Leaf className="mx-auto size-12 animate-pulse text-green-600" />
          <p className="mt-4 text-muted-foreground">
            Chargement des détails de la commande...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto size-12 text-red-600" />
          <h2 className="mt-4 text-xl font-semibold">Commande non trouvée</h2>
          <p className="mt-2 text-muted-foreground">
            La commande que vous recherchez n&apos;existe pas.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/commandes">Retour aux commandes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6 p-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/commandes" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Commande {order.orderNumber}
            </h1>
            <p className="text-muted-foreground">
              Passée le {formatDateTimeLong(order.date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 size-4" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 size-4" />
            Partager
          </Button>
          <Button className={statusConfig.buttonColor} size="sm">
            <StatusIcon className="mr-2 size-4" />
            {statusConfig.label}
          </Button>
        </div>
      </div>

      {/* Statut et actions rapides */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Statut de la commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${statusConfig.color}`}
            >
              <StatusIcon className="size-4" />
              <span className="font-semibold">{statusConfig.label}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {order.status === "livree" &&
                "Livraison effectuée le " + formatDateShort(order.deliveryDate)}
              {order.status === "en-preparation" &&
                "En cours de préparation pour livraison"}
              {order.status === "confirmee" &&
                "Commande confirmée, en attente de préparation"}
              {order.status === "en-attente" && "En attente de confirmation"}
              {order.status === "annulee" && "Commande annulée"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-green-600" />
              <span className="font-medium">
                {formatWeekdayDate(order.deliveryDate)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Truck className="size-4 text-green-600" />
              <span className="text-sm">
                {order.deliveryMethod === "livraison"
                  ? "Livraison à domicile"
                  : "Retrait en point de vente"}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={
                order.paymentStatus === "payee"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : order.paymentStatus === "en-attente"
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : "bg-red-100 text-red-800 border-red-200"
              }
            >
              {order.paymentStatus === "payee"
                ? "Payée"
                : order.paymentStatus === "en-attente"
                  ? "En attente"
                  : "Remboursée"}
            </Badge>
            <p className="mt-2 text-sm text-muted-foreground">
              {order.paymentMethod === "carte"
                ? "Carte bancaire"
                : order.paymentMethod === "virement"
                  ? "Virement"
                  : "Espèces"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne gauche - Articles et total */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5" />
                Articles ({order.itemsCount} produits)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/30">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.category === "fruits"
                            ? "Fruit"
                            : item.category === "legumes"
                              ? "Légume"
                              : item.category === "herbes"
                                ? "Aromatique"
                                : "Autre"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {item.total.toFixed(2)} €
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} {item.unit} ×{" "}
                        {item.unitPrice.toFixed(2)} €
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-6 h-px w-full bg-border" />

              {/* Total */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{(order.totalAmount * 0.8).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="text-green-600">
                    {order.deliveryMethod === "livraison"
                      ? "5,00 €"
                      : "Gratuit"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (20%)</span>
                  <span>{(order.totalAmount * 0.2).toFixed(2)} €</span>
                </div>
                <div className="h-px w-full bg-border" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">
                    {order.totalAmount.toFixed(2)} €
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes et instructions */}
          {order.notes && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <MessageCircle className="size-5" />
                  Notes du client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-700 dark:text-amber-300">
                  {order.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne droite - Informations client et actions */}
        <div className="space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">{order.customerName}</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 text-muted-foreground" />
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="text-green-600 hover:underline dark:text-green-400"
                    >
                      {order.customerEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-4 text-muted-foreground" />
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="text-green-600 hover:underline dark:text-green-400"
                    >
                      {order.customerPhone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {order.customerAddress}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <MessageCircle className="mr-2 size-4" />
                Contacter le client
              </Button>
            </CardContent>
          </Card>

          {/* Livraison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="size-5" />
                Livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-green-600" />
                  <span className="font-medium">
                    {formatDateShort(order.deliveryDate)}
                  </span>
                  <Badge variant="outline" className="ml-auto">
                    {order.deliveryDate.getHours()}:
                    {order.deliveryDate
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}
                  </Badge>
                </div>
                {order.deliveryAddress && (
                  <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/30">
                    <p className="text-sm font-medium">Adresse de livraison:</p>
                    <p className="text-sm text-muted-foreground">
                      {order.deliveryAddress}
                    </p>
                  </div>
                )}
                {order.deliveryInstructions && (
                  <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/30">
                    <p className="text-sm font-medium">
                      Instructions spéciales:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.deliveryInstructions}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="mr-2 size-4" />
                Marquer comme{" "}
                {order.status === "en-attente"
                  ? "confirmée"
                  : order.status === "confirmee"
                    ? "en préparation"
                    : order.status === "en-preparation"
                      ? "livrée"
                      : "traitée"}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 size-4" />
                Télécharger la facture
              </Button>
              {order.status === "en-attente" && (
                <Button variant="destructive" className="w-full justify-start">
                  <AlertCircle className="mr-2 size-4" />
                  Annuler la commande
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Timeline simplifiée */}
          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                    <ShoppingBag className="size-4 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="font-medium">Commande passée</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTimeShort(order.date)}
                    </p>
                  </div>
                </div>
                {order.status !== "en-attente" && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                      <CheckCircle className="size-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="font-medium">Commande confirmée</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTimeShort(
                          new Date(order.date.getTime() + 3600000),
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {(order.status === "en-preparation" ||
                  order.status === "livree") && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                      <Package className="size-4 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <p className="font-medium">En préparation</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTimeShort(
                          new Date(order.date.getTime() + 7200000),
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {order.status === "livree" && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                      <Truck className="size-4 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <p className="font-medium">Livrée</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTimeShort(order.deliveryDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
