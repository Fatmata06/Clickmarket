"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function HeroSection() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleCommanderNow = () => {
    if (!isAuthenticated) {
      toast.error(
        "Veuillez d'abord choisir des produits, puis vous connecter pour passer une commande",
      );
      router.push("/login");
      return;
    }
    router.push("/panier");
  };

  const handleVoirProduits = () => {
    router.push("/produits");
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-r from-green-100/20 to-emerald-100/10 dark:from-green-900/10 dark:to-emerald-900/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32 lg:pb-48">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm dark:bg-gray-800">
              🚀 Nouveau sur ClickMarket
            </Badge> */}

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Des fruits & légumes{" "}
              <span className="text-green-600 dark:text-green-400">frais</span>{" "}
              livrés chez vous
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Découvrez notre sélection de produits frais directement des
              producteurs locaux. Livraison rapide dans toutes les zones de la
              ville.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="gap-2 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleCommanderNow}
              >
                <ShoppingCart className="h-5 w-5" />
                Commander maintenant
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-8"
                onClick={handleVoirProduits}
              >
                Voir les produits
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-4"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                  500+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Produits frais
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                  24h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Livraison rapide
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                  100%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Satisfaction
                </div>
              </div>
            </motion.div>

            {/* Features */}
            {/* <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span>Livraison gratuite à partir de 10 000 FCFA</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span>Paiement à la livraison</span>
              </div>
            </div> */}
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 lg:mt-0 relative"
          >
            <div className="relative h-100 lg:h-125 rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-900/50">
              <Image
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800"
                alt="Fruits et légumes frais"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-6 right-6 surface-glass rounded-full p-4 shadow-lg dark:shadow-gray-900"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    -20%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Première commande
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-200/20 dark:bg-green-900/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-orange-200/20 dark:bg-orange-900/10 rounded-full"
            />
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="currentColor"
            className="text-white dark:text-gray-900"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
