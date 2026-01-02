"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  UserPlus,
  Settings,
  Shield,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardAdmin() {
  const router = useRouter();
  const { user, isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!hasRole("admin")) {
      router.replace("/");
    }
  }, [isAuthenticated, hasRole, router]);

  if (!isAuthenticated || !user) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      title: "Utilisateurs",
      value: "1,234",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      change: "+12% ce mois",
    },
    {
      title: "Produits",
      value: "456",
      icon: Package,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      change: "+8 ce mois",
    },
    {
      title: "Commandes",
      value: "892",
      icon: ShoppingCart,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      change: "45 en attente",
    },
    {
      title: "Revenus",
      value: "15.8M FCFA",
      icon: DollarSign,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      change: "+23% vs mois dernier",
    },
  ];

  const quickActions = [
    {
      title: "Gérer les utilisateurs",
      description: "Voir tous les utilisateurs",
      href: "/utilisateurs",
      icon: Users,
    },
    {
      title: "Gérer les produits",
      description: "Modérer les produits",
      href: "/produits",
      icon: Package,
    },
    {
      title: "Commandes",
      description: "Suivre les commandes",
      href: "/commandes",
      icon: ShoppingCart,
    },
    {
      title: "Statistiques",
      description: "Rapports et analyses",
      href: "/statistiques",
      icon: BarChart3,
    },
    {
      title: "Fournisseurs",
      description: "Gérer les fournisseurs",
      href: "/fournisseurs",
      icon: UserPlus,
    },
    {
      title: "Paramètres",
      description: "Configuration",
      href: "/parametres",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-8 w-8 text-emerald-600" />
              Tableau de bord Admin
            </h1>
            <p className="mt-2 text-muted-foreground">
              Bienvenue, {user.prenom} {user.nom}
            </p>
          </div>
          <Link href="/parametres">
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
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

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gestion rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "user",
                    text: "Nouvel utilisateur inscrit",
                    time: "Il y a 2h",
                  },
                  {
                    type: "product",
                    text: "Nouveau produit ajouté",
                    time: "Il y a 3h",
                  },
                  {
                    type: "order",
                    text: "Commande #123 livrée",
                    time: "Il y a 5h",
                  },
                  {
                    type: "user",
                    text: "Utilisateur bloqué",
                    time: "Il y a 1j",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                      {activity.type === "user" && (
                        <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {activity.type === "product" && (
                        <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {activity.type === "order" && (
                        <ShoppingCart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.text}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance globale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Taux de conversion
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    4.2%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: "42%" }}
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium">
                    Satisfaction client
                  </span>
                  <span className="text-sm font-bold text-blue-600">92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "92%" }}
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium">
                    Croissance mensuelle
                  </span>
                  <span className="text-sm font-bold text-purple-600">
                    +18%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "72%" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
