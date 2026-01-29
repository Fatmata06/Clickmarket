/**
 * Gestionnaire centralisé des erreurs d'authentification
 */

/**
 * Événement global pour les erreurs d'authentification
 * Les composants peuvent écouter cet événement pour réagir aux erreurs 401
 */
export const authErrorEvent = new EventTarget();

/**
 * Gérer les erreurs d'authentification (token expiré/invalide)
 * Cette fonction:
 * - Nettoie le localStorage
 * - Émet un événement global que les composants peuvent écouter
 * - Lance une erreur pour interrompre le flux
 */
export function handleAuthError(response?: Response): never {
  // Nettoyer les données d'authentification
  localStorage.removeItem("clickmarket_auth");
  localStorage.removeItem("cartSessionId");

  // Émettre un événement global
  authErrorEvent.dispatchEvent(
    new CustomEvent("authError", {
      detail: {
        status: response?.status || 401,
        message: "Session expirée",
      },
    }),
  );

  // Lancer une erreur pour interrompre le flux
  throw new Error("Token invalide ou expiré. Veuillez vous reconnecter.");
}

/**
 * Wrapper pour les appels API avec gestion automatique des erreurs 401
 */
export async function fetchWithAuthHandler(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    // Vérifier si c'est une erreur 401
    if (response.status === 401) {
      handleAuthError(response);
    }

    return response;
  } catch (error) {
    // Re-lancer l'erreur si c'est déjà une erreur d'auth
    if (error instanceof Error && error.message.includes("Token invalide")) {
      throw error;
    }
    // Pour les autres erreurs réseau
    throw new Error(
      `Erreur réseau: ${error instanceof Error ? error.message : "Inconnue"}`,
    );
  }
}

/**
 * Récupérer le token d'authentification depuis localStorage
 */
export function getAuthToken(): string | null {
  try {
    const authData = localStorage.getItem("clickmarket_auth");
    if (!authData) return null;

    const parsed = JSON.parse(authData);
    return parsed.token || null;
  } catch {
    return null;
  }
}

/**
 * Créer les headers d'authentification pour les requêtes API
 */
export function createAuthHeaders(
  additionalHeaders: Record<string, string> = {},
): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}
