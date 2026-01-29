/**
 * Utilitaires pour gérer les tokens JWT
 */

/**
 * Décode un token JWT sans vérifier la signature
 * (vérification côté client seulement - la vraie vérification est côté serveur)
 */
export function decodeToken(token: string): {
  userId?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
} | null {
  try {
    // Les JWT sont composés de 3 parties séparées par des points: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Décoder la partie payload (partie 2)
    const payload = parts[1];
    // Ajouter le padding si nécessaire
    const padded = payload + "===".substring(0, (4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));

    return decoded;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return null;
  }
}

/**
 * Vérifie si un token a expiré
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true; // Considérer comme expiré si on ne peut pas le décoder
  }

  // exp est en secondes, Date.now() est en millisecondes
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  // Retourner true si le token a expiré (avec une marge de 5 secondes)
  return currentTime >= expirationTime - 5000;
}

/**
 * Obtient le délai avant l'expiration du token en millisecondes
 */
export function getTokenExpirationDelay(token: string): number {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return 0;
  }

  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const delay = expirationTime - currentTime;

  // Retourner au minimum 0
  return Math.max(0, delay);
}

/**
 * Formate le délai en texte lisible
 */
export function formatTimeRemaining(delayMs: number): string {
  const seconds = Math.floor(delayMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}j ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}
