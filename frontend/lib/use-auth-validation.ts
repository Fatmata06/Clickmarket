/**
 * Hook pour gérer l'authentification et les erreurs d'authentification
 */

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { isTokenExpired, getTokenExpirationDelay } from "@/lib/token-utils";
import { toast } from "sonner";

const CHECK_INTERVAL = 10000; // Vérifier toutes les 10 secondes

export function useAuthValidation() {
  const router = useRouter();
  const { token, logout, isLoading } = useAuth();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownExpirationWarning = useRef(false);

  // Fonction pour gérer la déconnexion
  const handleTokenExpired = useCallback(() => {
    if (!hasShownExpirationWarning.current) {
      hasShownExpirationWarning.current = true;
      toast.error("Votre session a expiré. Veuillez vous reconnecter.");
      logout();
      router.replace("/login");
    }
  }, [logout, router]);

  // Écouter les erreurs 401 globalement
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      // Si c'est un 401, c'est que le token est invalide/expiré
      if (response.status === 401) {
        // Vérifier si on a un token et si on est authentifié
        const authData = localStorage.getItem("clickmarket_auth");
        if (authData) {
          handleTokenExpired();
        }
      }

      return response;
    };

    return () => {
      // Restaurer le fetch original
      window.fetch = originalFetch;
    };
  }, [handleTokenExpired]);

  // Vérifier périodiquement l'expiration du token
  useEffect(() => {
    if (isLoading || !token) return;

    // Vérification immédiate
    if (isTokenExpired(token)) {
      handleTokenExpired();
      return;
    }

    // Vérification périodique
    checkIntervalRef.current = setInterval(() => {
      if (isTokenExpired(token)) {
        handleTokenExpired();
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      }
    }, CHECK_INTERVAL);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [token, isLoading, handleTokenExpired]);

  // Avertissement d'expiration imminente (5 minutes avant)
  useEffect(() => {
    if (isLoading || !token) return;

    const delay = getTokenExpirationDelay(token);
    const FIVE_MINUTES = 5 * 60 * 1000;

    // Si expiration dans moins de 5 minutes
    if (delay <= FIVE_MINUTES && delay > 0) {
      const timeout = setTimeout(
        () => {
          if (!hasShownExpirationWarning.current) {
            toast.warning(
              "Votre session expire bientôt. Veuillez rafraîchir la page ou vous reconnecter.",
              {
                duration: 10000,
              },
            );
          }
        },
        Math.max(0, delay - FIVE_MINUTES),
      );

      return () => clearTimeout(timeout);
    }
  }, [token, isLoading]);
}
