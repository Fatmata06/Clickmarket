import {
  handleAuthError as handleAuthErrorCentralized,
  authErrorEvent as authErrorEventCentralized,
} from "./auth-error-handler";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://clickmarche.onrender.com/api";

/**
 * Événement d'erreur d'authentification pour la redirection globale
 * @deprecated Utilisez authErrorEvent depuis auth-error-handler
 */
export const authErrorEvent = authErrorEventCentralized;

/**
 * Gérer les erreurs d'authentification (token expiré/invalide)
 * @deprecated Utilisez handleAuthError depuis auth-error-handler
 */
export function handleAuthError(response?: Response) {
  handleAuthErrorCentralized(response);
}

interface CreateCommandeData {
  adresseLivraison?: string;
  methodeLivraison?: "livraison" | "retrait";
  zoneLivraison?: string;
  aLivrer?: boolean;
  dateLivraison?: string;
}

export interface Commande {
  _id: string;
  numero?: string;
  utilisateur: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  articles: Array<{
    produit: {
      _id: string;
      nomProduit: string;
      prix: number;
      images?: string[];
      fournisseur?: {
        _id: string;
        nom: string;
      };
    };
    quantite: number;
    prixUnitaire: number;
    total: number;
  }>;
  montantTotal: number;
  fraisLivraison: number;
  statutCommande:
    | "en_attente"
    | "confirmee"
    | "en_cours"
    | "expediee"
    | "livree"
    | "annulee";
  paiement: {
    statut: "en_attente" | "en_cours" | "paye" | "echoue" | "rembourse";
    montantPaye: number;
  };
  methodePaiement?: string;
  adresseLivraison?: {
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
  };
  methodeLivraison: "livraison" | "retrait";
  aLivrer?: boolean;
  zoneLivraison?: {
    _id: string;
    nom: string;
  };
  dateCommande: string;
  dateLivraison?: string;
  historique?: Array<{
    statut: string;
    date: string;
    changedBy?: string;
    raison?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Créer une nouvelle commande à partir du panier de l'utilisateur
 */
export async function createCommande(
  data: CreateCommandeData = {},
): Promise<Commande> {
  try {
    const authData = localStorage.getItem("clickmarket_auth");
    if (!authData) {
      throw new Error("Non authentifié. Veuillez vous reconnecter.");
    }

    let token: string;
    try {
      const parsed = JSON.parse(authData);
      token = parsed.token;
      if (!token) {
        throw new Error("Token manquant");
      }
    } catch (parseError) {
      console.error("Erreur parsing token:", parseError);
      throw new Error("Token invalide. Veuillez vous reconnecter.");
    }

    // Convertir methodeLivraison en aLivrer
    const bodyData = { ...data };
    if (data.methodeLivraison === "retrait") {
      bodyData.aLivrer = false;
    } else if (data.methodeLivraison === "livraison") {
      bodyData.aLivrer = true;
    }
    delete bodyData.methodeLivraison;

    const response = await fetch(`${API_URL}/commandes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur serveur" }));

      // N'appeler handleAuthError que si c'est vraiment une erreur 401
      if (response.status === 401) {
        handleAuthError(response);
      }

      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    const result = await response.json();
    return result.commande || result;
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    throw error;
  }
}

/**
 * Récupérer toutes les commandes de l'utilisateur
 */
export async function getCommandes(): Promise<Commande[]> {
  try {
    const authData = localStorage.getItem("clickmarket_auth");
    if (!authData) {
      throw new Error("Non authentifié");
    }

    const { token } = JSON.parse(authData);

    const response = await fetch(`${API_URL}/commandes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      handleAuthError(response);
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur serveur" }));
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    const result = await response.json();
    return result.commandes || result;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    throw error;
  }
}

/**
 * Récupérer une commande spécifique par ID
 */
export async function getCommande(id: string): Promise<Commande> {
  try {
    const authData = localStorage.getItem("clickmarket_auth");
    if (!authData) {
      throw new Error("Non authentifié");
    }

    const { token } = JSON.parse(authData);

    const response = await fetch(`${API_URL}/commandes/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      handleAuthError(response);
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur serveur" }));
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    const result = await response.json();
    return result.commande || result;
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
    throw error;
  }
}

/**
 * Annuler une commande (seulement si statut = en_attente ou confirmee)
 */
export async function cancelCommande(
  id: string,
  raison?: string,
): Promise<void> {
  try {
    const authData = localStorage.getItem("clickmarket_auth");
    if (!authData) {
      throw new Error("Non authentifié");
    }

    const { token } = JSON.parse(authData);

    const response = await fetch(`${API_URL}/commandes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ raison: raison || "" }),
    });

    if (!response.ok) {
      handleAuthError(response);
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur serveur" }));
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'annulation de la commande:", error);
    throw error;
  }
}

/**
 * Mettre à jour le statut d'une commande (admin/fournisseur uniquement)
 * Cela met à jour automatiquement l'historique de la commande
 */
export async function updateCommandeStatus(
  id: string,
  statut:
    | "en_attente"
    | "confirmee"
    | "en_preparation"
    | "expediee"
    | "livree"
    | "annulee",
  raison?: string,
): Promise<Commande> {
  try {
    const authData = localStorage.getItem("clickmarket_auth");
    if (!authData) {
      throw new Error("Non authentifié");
    }

    const { token } = JSON.parse(authData);

    const response = await fetch(`${API_URL}/commandes/${id}/statut`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        statut,
        raison: raison || undefined,
        // Si on annule la commande, annuler aussi le paiement
        ...(statut === "annulee" && { paiementStatut: "annule" }),
      }),
    });

    if (!response.ok) {
      handleAuthError(response);
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur serveur" }));
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw error;
  }
}

/**
 * Mettre à jour l'adresse de livraison d'une commande
 */
export async function updateCommandeAddress(
  id: string,
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
    pays?: string;
  },
): Promise<Commande> {
  try {
    const authData = localStorage.getItem("clickmarket_auth");
    if (!authData) {
      throw new Error("Non authentifié");
    }

    const { token } = JSON.parse(authData);

    const response = await fetch(`${API_URL}/commandes/${id}/adresse`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ adresseLivraison: adresse }),
    });

    if (!response.ok) {
      handleAuthError(response);
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur serveur" }));
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'adresse:", error);
    throw error;
  }
}
