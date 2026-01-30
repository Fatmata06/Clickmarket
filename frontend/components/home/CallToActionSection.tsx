import { CheckCircle, Package, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";

export default function CallToActionSection() {
  return (
    <section className="max-w-7xl mx-auto sm:px-6 py-6">
      <div className="bg-green-50 dark:bg-slate-800 rounded-xl p-4 sm:p-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Vous êtes ?</h2>
          <p className="text-gray-700 dark:text-slate-300 text-md md:text-lg">
            Choisissez votre profil pour commencer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="surface-card rounded-lg p-4 sm:p-8"
          >
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
              <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Client</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Accédez à un catalogue complet de produits et passez vos commandes
              en toute simplicité
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Recherche avancée de produits
              </li>
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Suivi de commandes en temps réel
              </li>
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Paiements sécurisés
              </li>
            </ul>
            <Button asChild
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold hover:shadow-lg transition"
            >
              <Link href="/register">Créer un compte Client</Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="surface-card rounded-lg p-4 sm:p-8"
          >
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Fournisseur
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Développez votre activité en touchant de nouveaux clients et en
              gérant vos ventes efficacement
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Gestion de catalogue produits
              </li>
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Suivi des commandes et stock
              </li>
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Statistiques de vente
              </li>
            </ul>
            <Button asChild
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold hover:shadow-lg transition"
            >
              <Link href="/contact">Créer un compte Fournisseur</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
