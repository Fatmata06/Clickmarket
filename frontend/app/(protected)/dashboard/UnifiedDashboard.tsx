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
  Heart,
  MapPin,
  TrendingUp,
  Plus,
  Eye,
  BarChart3,
  ShoppingBag,
  User,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Configuration des dashboards par rôle
const dashboardConfigs = {
  admin: {
    title: "Tableau de bord Administrateur",
    stats: [
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
        value: "2.5M FCFA",
        icon: DollarSign,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        change: "+23% ce mois",
      },
    ],
    quickActions: [
      {
        title: "Gérer les utilisateurs",
        description: "Voir et gérer tous les utilisateurs",
        icon: Users,
        href: "/admin/users",
        color: "text-blue-600",
      },
      {
        title: "Gérer les produits",
        description: "Ajouter ou modifier des produits",
        icon: Package,
        href: "/produits/gestion",
        color: "text-emerald-600",
      },
      {
        title: "Voir les commandes",
        description: "Suivre toutes les commandes",
        icon: ShoppingCart,
        href: "/commandes",
        color: "text-amber-600",
      },
      {
        title: "Paramètres système",
        description: "Configurer la plateforme",
        icon: Settings,
        href: "/admin/settings",
        color: "text-gray-600",
      },
    ],
  },
  fournisseur: {
    title: "Tableau de bord Fournisseur",
    stats: [
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
        title: "Performance",
        value: "4.8/5",
        icon: TrendingUp,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        change: "145 avis",
      },
    ],
    quickActions: [
      {
        title: "Ajouter un produit",
        description: "Créer un nouveau produit",
        icon: Plus,
        href: "/fournisseur/produits/nouveau",
        color: "text-emerald-600",
      },
      {
        title: "Mes produits",
        description: "Gérer mon catalogue",
        icon: Eye,
        href: "/fournisseur/produits",
        color: "text-blue-600",
      },
      {
        title: "Mes commandes",
        description: "Suivre mes ventes",
        icon: ShoppingCart,
        href: "/commandes",
        color: "text-amber-600",
      },
      {
        title: "Statistiques",
        description: "Analyser mes performances",
        icon: BarChart3,
        href: "/fournisseur/stats",
        color: "text-purple-600",
      },
    ],
  },
  client: {
    title: "Tableau de bord Client",
    stats: [
      {
        title: "En cours",
        value: "3",
        icon: Package,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        cardColor: "surface-muted",
      },
      {
        title: "Livrées",
        value: "12",
        icon: ShoppingBag,
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        change: "3 en cours",
      },
      {
        title: "Favoris",
        value: "8",
        icon: Heart,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-destructive/10 dark:bg-destructive/20",
        change: "Produits sauvegardés",
      },
      {
        title: "Adresses",
        value: "2",
        icon: MapPin,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        change: "Adresses enregistrées",
      },
    ],
    quickActions: [
      {
        title: "Parcourir les produits",
        description: "Découvrir les produits disponibles",
        icon: Package,
        href: "/produits",
        color: "text-emerald-600",
      },
      {
        title: "Mes commandes",
        description: "Suivre mes achats",
        icon: ShoppingBag,
        href: "/commandes",
        color: "text-blue-600",
      },
      {
        title: "Mes favoris",
        description: "Voir mes produits favoris",
        icon: Heart,
        href: "/favoris",
        color: "text-red-600",
      },
      {
        title: "Mon profil",
        description: "Gérer mon compte",
        icon: User,
        href: "/profil",
        color: "text-gray-600",
      },
    ],
  },
};

export default function UnifiedDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return <LoadingSpinner />;
  }

  // Déterminer le rôle et obtenir la configuration appropriée
  let config = dashboardConfigs.client; // Par défaut
  if (hasRole("admin")) {
    config = dashboardConfigs.admin;
  } else if (hasRole("fournisseur")) {
    config = dashboardConfigs.fournisseur;
  }

  return (
    <div className="page-container-md">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
        <p className="text-muted-foreground">
          Bienvenue, {user.prenom || user.nom || user.email} !
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {config.stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {config.quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {action.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Section spécifique selon le rôle */}
      {hasRole("fournisseur") && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Activité récente</h2>
          <Card>
            <CardHeader>
              <CardTitle>Ventes récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Consultez vos dernières commandes dans la section{" "}
                <Link
                  href="/commandes"
                  className="text-primary hover:underline"
                >
                  Mes commandes
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {hasRole("client") && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recommandations</h2>
          <Card>
            <CardHeader>
              <CardTitle>Produits populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Découvrez les produits les plus populaires dans la section{" "}
                <Link href="/produits" className="text-primary hover:underline">
                  Produits
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {hasRole("admin") && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Aperçu du système</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  45 nouvelles commandes aujourd&apos;hui
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Alertes système</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Aucune alerte pour le moment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
