"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useAuthValidation } from "@/lib/use-auth-validation";
import { isTokenExpired } from "@/lib/token-utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ProtectedPageWrapperProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackUrl?: string;
}

/**
 * Composant de protection pour les pages qui nécessitent une authentification
 *
 * Utilisation:
 * <ProtectedPageWrapper requiredRoles={["client", "admin"]}>
 *   <YourPageContent />
 * </ProtectedPageWrapper>
 *
 * @param children - Le contenu de la page à protéger
 * @param requiredRoles - Rôles autorisés (optionnel, vide = tous les rôles authentifiés)
 * @param fallbackUrl - URL de redirection si non autorisé (par défaut: /login)
 */
export default function ProtectedPageWrapper({
  children,
  requiredRoles = [],
  fallbackUrl = "/login",
}: ProtectedPageWrapperProps) {
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
      router.replace(fallbackUrl);
      return;
    }

    // Vérifier si le token a expiré
    if (token && isTokenExpired(token)) {
      logout();
      router.replace(fallbackUrl);
      return;
    }

    // Vérifier les rôles requis
    if (requiredRoles.length > 0 && user && user.role) {
      if (!requiredRoles.includes(user.role)) {
        // Rediriger vers la page d'accueil si le rôle n'est pas autorisé
        router.replace("/");
        return;
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    token,
    router,
    logout,
    requiredRoles,
    fallbackUrl,
    user,
  ]);

  // Afficher un spinner pendant le chargement
  if (isLoading || !isAuthenticated || !token) {
    return <LoadingSpinner />;
  }

  // Vérifier les rôles requis
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return <LoadingSpinner />;
  }

  return children;
}
