import { useMemo } from "react";

interface UserData {
  _id: string;
  nom?: string;
  prenom?: string;
  email: string;
  role: string;
  nomEntreprise?: string;
}

/**
 * Hook pour récupérer les informations de l'utilisateur connecté
 */
export function useUserRole() {
  // Lecture directe depuis localStorage avec useMemo pour éviter les re-lectures inutiles
  const { user, role } = useMemo<{
    user: UserData | null;
    role: string;
  }>(() => {
    if (typeof window === "undefined") {
      return { user: null, role: "" };
    }

    const authData = localStorage.getItem("clickmarket_auth");

    if (authData) {
      try {
        const { user: userData } = JSON.parse(authData);
        return { user: userData, role: userData?.role || "" };
      } catch (error) {
        console.error(
          "Erreur lors de la lecture des données utilisateur:",
          error,
        );
      }
    }

    return { user: null, role: "" };
  }, []); // Dépendances vides car on veut lire une seule fois au montage

  const hasRole = (allowedRoles: string | string[]): boolean => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(role);
  };

  return {
    user,
    role,
    hasRole,
    isAdmin: role === "admin",
    isFournisseur: role === "fournisseur",
    isClient: role === "client",
  };
}
