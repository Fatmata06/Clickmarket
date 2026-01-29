"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useRoleAccess } from "@/lib/hooks/useRoleAccess";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Users,
  Search,
  Trash2,
  Loader2,
  AlertCircle,
  Shield,
  Store,
  User as UserIcon,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: "admin" | "fournisseur" | "client";
  nomEntreprise?: string;
  createdAt: string;
  isActive?: boolean;
}

interface PaginationData {
  total: number;
  page: number;
  pages: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminUsersPage() {
  useRoleAccess(["admin"]);

  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pages: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, roleFilter, pagination.page]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const authData = localStorage.getItem("clickmarket_auth");
      if (!authData) {
        router.push("/login");
        return;
      }

      const { token } = JSON.parse(authData);

      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", "20");
      if (searchQuery) params.append("search", searchQuery);
      if (roleFilter !== "all") params.append("role", roleFilter);

      const response = await fetch(`${API_URL}/admin/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Erreur lors du chargement des utilisateurs");
      }

      const data = await response.json();
      setUsers(data.users || data.data || []);
      setPagination({
        total: data.total || 0,
        page: data.page || 1,
        pages: data.pages || 1,
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const authData = localStorage.getItem("clickmarket_auth");
      if (!authData) {
        router.push("/login");
        return;
      }

      const { token } = JSON.parse(authData);

      const response = await fetch(
        `${API_URL}/admin/users/${userToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      toast.success("Utilisateur supprimé avec succès");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      await loadUsers();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-300";
      case "fournisseur":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "client":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 mr-1" />;
      case "fournisseur":
        return <Store className="h-4 w-4 mr-1" />;
      case "client":
        return <UserIcon className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  if (isLoading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Button>
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        </div>
        <p className="text-muted-foreground">
          Gérez les utilisateurs de la plateforme
        </p>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filtre par rôle */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">Administrateurs</SelectItem>
                <SelectItem value="fournisseur">Fournisseurs</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des utilisateurs */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun utilisateur</h3>
              <p className="text-muted-foreground">
                Aucun utilisateur ne correspond à votre recherche
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <Card key={user._id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">
                        {user.prenom} {user.nom}
                      </CardTitle>
                      <CardDescription className="line-clamp-1">
                        {user.email}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setUserToDelete(user);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Rôle */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Rôle
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getRoleColor(user.role)} capitalize`}
                    >
                      {getRoleIcon(user.role)}
                      {user.role === "fournisseur" ? "Fournisseur" : user.role}
                    </Badge>
                  </div>

                  {/* Entreprise (si fournisseur) */}
                  {user.nomEntreprise && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Entreprise
                      </div>
                      <p className="text-sm font-medium">
                        {user.nomEntreprise}
                      </p>
                    </div>
                  )}

                  {/* Date d'inscription */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Inscrit le
                    </div>
                    <p className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  {/* Statut */}
                  {user.isActive !== undefined && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Statut
                      </div>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  )}
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
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
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
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(pagination.pages, prev.page + 1),
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
              Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
              <strong>
                {userToDelete?.prenom} {userToDelete?.nom}
              </strong>
              ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
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
    </div>
  );
}
