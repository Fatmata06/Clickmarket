"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useAuthValidation } from "@/lib/use-auth-validation";
import { isTokenExpired } from "@/lib/token-utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, token, logout } = useAuth();

  // Utiliser le hook de validation d'authentification
  useAuthValidation();

  useEffect(() => {
    // Ne pas vérifier pendant le chargement initial
    if (isLoading) {
      return;
    }

    // Vérifier si l'utilisateur est authentifié
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Vérifier si le token a expiré
    if (token && isTokenExpired(token)) {
      logout();
      router.replace("/login");
      return;
    }
  }, [isAuthenticated, isLoading, token, router, logout]);

  if (isLoading || !isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
