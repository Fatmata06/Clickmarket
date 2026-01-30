"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductNotFoundProps {
  id?: string;
  reason?: "deleted" | "modified" | "not_found";
  showBackButton?: boolean;
}

export default function ProductNotFound({
  id,
  reason = "not_found",
  showBackButton = true,
}: ProductNotFoundProps) {
  const router = useRouter();

  const getTitleAndMessage = () => {
    switch (reason) {
      case "deleted":
        return {
          title: "Produit supprimé",
          message:
            "Désolé, ce produit a été supprimé de notre catalogue. Il n'est plus disponible.",
          icon: "🗑️",
        };
      case "modified":
        return {
          title: "Produit modifié",
          message:
            "Ce produit a été modifié ou n'existe plus. Veuillez vérifier votre lien.",
          icon: "✏️",
        };
      default:
        return {
          title: "Produit non trouvé",
          message:
            "Désolé, ce produit n'existe pas ou n'est pas disponible actuellement.",
          icon: "🔍",
        };
    }
  };

  const { title, message, icon } = getTitleAndMessage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/10 dark:bg-destructive/20 rounded-full blur-lg"></div>
              <div className="relative bg-card rounded-full w-24 h-24 flex items-center justify-center text-5xl border-2 border-border">
                {icon}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {message}
            </p>
          </div>

          {/* Product ID (if available) */}
          {id && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                <span className="font-semibold">ID du produit:</span>
                <br />
                <code className="text-xs bg-gray-200 dark:bg-slate-600 px-2 py-1 rounded inline-block mt-2">
                  {id}
                </code>
              </p>
            </div>
          )}

          {/* Suggestions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
              💡 Vous pouvez consulter notre catalogue complet ou revenir à la
              page précédente pour continuer votre shopping.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {showBackButton && (
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la page précédente
              </Button>
            )}

            <Link href="/produits" className="w-full">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Voir tous les produits
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Si vous pensez qu&apos;il y a une erreur, n&apos;hésitez pas à{" "}
            <Link
              href="/contact"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              nous contacter
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
