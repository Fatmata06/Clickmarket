const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://clickmarche.onrender.com/api";

export interface ZoneLivraison {
  _id: string;
  nom: string;
  description?: string;
  prix: number;
  delaiLivraison?: string;
  estActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Récupérer toutes les zones de livraison actives
 */
export async function getZonesLivraison(): Promise<ZoneLivraison[]> {
  try {
    const response = await fetch(`${API_URL}/zones-livraison`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur serveur" }));
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    const result = await response.json();
    return result.zones || result;
  } catch (error) {
    console.error("Erreur lors de la récupération des zones:", error);
    throw error;
  }
}
