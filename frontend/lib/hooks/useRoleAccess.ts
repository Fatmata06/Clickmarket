import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useAuthValidation } from "@/lib/use-auth-validation";
import { isTokenExpired } from "@/lib/token-utils";
import { toast } from "sonner";

/**
 * Hook pour vérifier l'accès basé sur le rôle ET l'authentification
 * @param allowedRoles - Rôles autorisés à accéder à la page
 * @param redirectTo - Chemin de redirection si non autorisé (par défaut "/dashboard")
 */
export function useRoleAccess(
  allowedRoles: string[],
  redirectTo: string = "/dashboard",
) {
  const router = useRouter();
  const { isAuthenticated, isLoading, token, logout, user } = useAuth();

  // Utiliser le hook de validation d'authentification
  useAuthValidation();

  useEffect(() => {
    // Ne pas vérifier pendant le chargement initial
    if (isLoading) {
      return;
    }

    // Vérifier si l'utilisateur est authentifié
    if (!isAuthenticated || !token) {
      router.replace("/login");
      return;
    }

    // Vérifier si le token a expiré
    if (token && isTokenExpired(token)) {
      logout();
      router.replace("/login");
      return;
    }

    // Vérifier les rôles autorisés
    if (!user || !user.role) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      toast.error(
        `Accès refusé. ${
          allowedRoles.length === 1
            ? `Réservé aux ${allowedRoles[0]}s.`
            : `Réservé aux utilisateurs autorisés.`
        }`,
      );
      router.replace(redirectTo);
    }
  }, [
    router,
    allowedRoles,
    redirectTo,
    isAuthenticated,
    isLoading,
    token,
    logout,
    user,
  ]);
}
