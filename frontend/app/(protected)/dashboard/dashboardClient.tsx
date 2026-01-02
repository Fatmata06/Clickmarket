"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  ShoppingBag,
  Package,
  Heart,
  MapPin,
  User,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardClient() {
  const router = useRouter();
  const { user, isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!hasRole("client")) {
      router.replace("/");
    }
  }, [isAuthenticated, hasRole, router]);

  if (!isAuthenticated || !user) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      title: "En cours",
      value: "3",
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      cardColor: "bg-gray-100 border border-gray-200 dark:bg-gray-900 dark:border-gray-700",
    },
    {
      title: "Livrées",
      value: "12",
      icon: ShoppingBag,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      cardColor: "bg-gray-100 border border-gray-200 dark:bg-gray-900 dark:border-gray-700",
    },
    {
      title: "Favoris",
      value: "8",
      icon: Heart,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      cardColor: "bg-gray-100 border border-gray-200 dark:bg-gray-900 dark:border-gray-700",
    },
    {
      title: "Adresses",
      value: "2",
      icon: MapPin,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      cardColor: "bg-gray-100 border border-gray-200 dark:bg-gray-900 dark:border-gray-700",
    },
  ];

  const quickActions = [
    {
      title: "Mes commandes",
      description: "Suivre mes commandes",
      href: "/client/commandes",
      icon: Package,
      cardColor: "p-2 rounded cursor-pointer bg-gray-100 dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800",
    },
    {
      title: "Mes favoris",
      description: "Produits sauvegardés",
      href: "/client/favoris",
      icon: Heart,
      cardColor: "p-2 rounded cursor-pointer bg-gray-100 dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800",
    },
    {
      title: "Mon profil",
      description: "Modifier mes informations",
      href: "/client/profil",
      icon: User,
      cardColor: "p-2 rounded cursor-pointer bg-gray-100 dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800",
    },
    {
      title: "Notifications",
      description: "Voir mes notifications",
      href: "/client/notifications",
      icon: Bell,
      cardColor: "p-2 rounded cursor-pointer bg-gray-100 dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800",
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Tableau de bord Client
          </h1>
          <p className="mt-2 text-muted-foreground">
            Bienvenue, {user.prenom} {user.nom}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className={stat.cardColor}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          <Card className="p-2 py-4 sm:p-4 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <div className="grid grid-cols-2 sm:gap-4 gap-2">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href} className={action.cardColor}>
                    <Button
                      // variant="outline"
                      className="cursor-pointer w-full h-auto flex flex-col items-start p-4 hover:bg-accent"
                    >
                      <action.icon className="h-5 w-5 mb-2" />
                      <span className="font-semibold">{action.title}</span>
                      <span className="text-wrap text-xs text-muted-foreground mt-1">
                        {action.description}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="p-2 py-4 sm:p-4 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-3">
                {[1, 2, 3].map((order) => (
                  <div
                    key={order}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 flex items-center justify-between p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                        <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium">Commande #{order}</p>
                        <p className="text-sm text-muted-foreground">
                          Il y a {order} jour{order > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
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
