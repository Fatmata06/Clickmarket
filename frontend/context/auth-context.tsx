"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { mergeCartAfterLogin } from "@/lib/api/cart";
import { isTokenExpired } from "@/lib/token-utils";
import { authErrorEvent } from "@/lib/api/auth-error-handler";

const STORAGE_KEY = "clickmarket_auth";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type User = {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  role?: string;
};

type LoginPayload = {
  email: string;
  motDePasse: string;
};

type RegisterPayload = {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { user?: User; token?: string };

        // Vérifier si le token a expiré
        if (parsed.token && isTokenExpired(parsed.token)) {
          // Token expiré, le nettoyer
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
          setToken(null);
        } else {
          // Token valide, charger les données
          setUser(parsed.user ?? null);
          setToken(parsed.token ?? null);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  // Écouter les événements d'erreur d'authentification globaux
  useEffect(() => {
    const handleAuthErrorEvent = () => {
      // Déconnecter l'utilisateur si une erreur 401 est détectée
      setUser(null);
      setToken(null);
      setError("Session expirée");
      localStorage.removeItem(STORAGE_KEY);
    };

    authErrorEvent.addEventListener("authError", handleAuthErrorEvent);

    return () => {
      authErrorEvent.removeEventListener("authError", handleAuthErrorEvent);
    };
  }, []);

  const persist = (nextToken: string | null, nextUser?: User | null) => {
    if (nextToken) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: nextToken, user: nextUser || null }),
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Login function
  const login = useCallback(async ({ email, motDePasse }: LoginPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, motDePasse }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          (data && (data.message as string | undefined)) ??
            "Impossible de se connecter pour le moment.",
        );
      }

      const nextUser: User = {
        id: data.user?.id ?? data.user?._id ?? "",
        email: data.user?.email ?? email,
        nom: data.user?.nom,
        prenom: data.user?.prenom,
        role: data.user?.role,
      };

      setUser(nextUser);
      setToken(data.token);
      persist(data.token, nextUser);

      // Si c'est un admin ou fournisseur, vider complètement le panier
      if (nextUser.role === "admin" || nextUser.role === "fournisseur") {
        localStorage.removeItem("cartSessionId");
        window.dispatchEvent(new Event("admin-login-clear-cart"));
      } else {
        // Fusionner les paniers : panier invité + panier utilisateur
        const sessionId = localStorage.getItem("cartSessionId");
        if (sessionId) {
          try {
            await mergeCartAfterLogin(sessionId);
            console.log("✅ Paniers fusionnés avec succès");
          } catch (mergeError) {
            console.error("❌ Erreur fusion paniers:", mergeError);
            // Ne pas bloquer la connexion si la fusion échoue
          }
        }

        // Nettoyer le sessionId du panier invité après fusion
        localStorage.removeItem("cartSessionId");

        // Déclencher un événement pour recharger le panier fusionné
        window.dispatchEvent(new Event("auth-changed"));
      }

      return nextUser;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue.";
      setError(message);
      throw err instanceof Error ? err : new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    persist(null, null);
    // Ne PAS nettoyer le sessionId lors de la déconnexion pour garder le panier
  }, []);

  // Register function
  const register = useCallback(
    async ({
      nom,
      prenom,
      email,
      motDePasse,
      role = "client",
    }: RegisterPayload) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nom, prenom, email, motDePasse, role }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            (data && (data.message as string | undefined)) ??
              "Erreur lors de l'inscription.",
          );
        }

        const nextUser: User = {
          id: data.user?.id ?? data.user?._id ?? "",
          email: data.user?.email ?? email,
          nom: data.user?.nom,
          prenom: data.user?.prenom,
          role: data.user?.role,
        };

        return nextUser;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Une erreur est survenue.";
        setError(message);
        throw err instanceof Error ? err : new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Request password reset function
  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/request-password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          (data && (data.message as string | undefined)) ??
            "Erreur lors de la demande.",
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue.";
      setError(message);
      throw err instanceof Error ? err : new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Role checking function
  const hasRole = useCallback(
    (roles: string | string[]) => {
      const roleList = Array.isArray(roles) ? roles : [roles];
      const currentRole = user?.role?.toLowerCase();
      if (!currentRole) return false;

      return roleList.some((role) => role.toLowerCase() === currentRole);
    },
    [user],
  );

  // Memoized context value
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      error,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      register,
      logout,
      requestPasswordReset,
      hasRole,
    }),
    [
      user,
      token,
      error,
      isLoading,
      login,
      register,
      logout,
      requestPasswordReset,
      hasRole,
    ],
  );

  if (!hydrated) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
