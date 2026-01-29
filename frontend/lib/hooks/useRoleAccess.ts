import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Hook pour vérifier l'accès basé sur le rôle utilisateur
 * @param allowedRoles - Rôles autorisés à accéder à la page
 * @param redirectTo - Chemin de redirection si non autorisé (par défaut "/dashboard")
 */
export function useRoleAccess(
  allowedRoles: string[],
  redirectTo: string = "/dashboard",
) {
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem("clickmarket_auth");

    if (!authData) {
      router.push("/login");
      return;
    }

    try {
      const { user } = JSON.parse(authData);

      if (!user) {
        router.push("/login");
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
        router.push(redirectTo);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la lecture des données utilisateur:",
        error,
      );
      router.push("/login");
    }
  }, [router, allowedRoles, redirectTo]);
}
