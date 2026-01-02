"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Package,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Plus,
  Eye,
  Edit,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardFournisseur() {
  const router = useRouter();
  const { user, isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!hasRole("fournisseur")) {
      router.replace("/");
    }
  }, [isAuthenticated, hasRole, router]);

  if (!isAuthenticated || !user) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      title: "Produits actifs",
      value: "24",
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      change: "+2 ce mois",
    },
    {
      title: "Ventes totales",
      value: "1.2M FCFA",
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      change: "+15% vs mois dernier",
    },
    {
      title: "Commandes",
      value: "48",
      icon: ShoppingCart,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      change: "12 en attente",
    },
    {
      title: "Taux de conversion",
      value: "3.2%",
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      change: "+0.5%",
    },
  ];

  const quickActions = [
    {
      title: "Ajouter un produit",
      description: "Créer un nouveau produit",
      href: "/fournisseur/produits/nouveau",
      icon: Plus,
    },
    {
      title: "Mes produits",
      description: "Gérer mes produits",
      href: "/fournisseur/produits",
      icon: Package,
    },
    {
      title: "Commandes",
      description: "Gérer les commandes",
      href: "/fournisseur/commandes",
      icon: ShoppingCart,
    },
    {
      title: "Statistiques",
      description: "Voir les performances",
      href: "/fournisseur/statistiques",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Tableau de bord Fournisseur
            </h1>
            <p className="mt-2 text-muted-foreground">
              Bienvenue, {user.prenom} {user.nom}
            </p>
          </div>
          <Link href="/fournisseur/produits/nouveau">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau produit
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full h-auto flex flex-col items-start p-4 hover:bg-accent"
                    >
                      <action.icon className="h-5 w-5 mb-2" />
                      <span className="font-semibold">{action.title}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {action.description}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card>
            <CardHeader>
              <CardTitle>Produits récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((product) => (
                  <div
                    key={product}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Produit #{product}</p>
                        <p className="text-sm text-muted-foreground">
                          {product * 5} ventes
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
