"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Clock, Shield, Users } from "lucide-react";

const features = [
  {
    icon: <Leaf className="h-8 w-8" />,
    title: "Produits 100% Frais",
    description: "Directement des producteurs locaux, garantis frais",
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Livraison Rapide",
    description: "Livraison en 24h maximum dans toutes les zones",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Paiement Sécurisé",
    description: "Paiement à la livraison ou via Wave/Orange Money",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Support Client",
    description: "Équipe disponible 7j/7 pour vous accompagner",
  },
];

export default function WhyChooseUs() {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Pourquoi choisir{" "}
        <span className="text-green-600 dark:text-green-400">ClickMarket</span>
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="shadow-lg hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-300 h-full">
              <CardContent className="p-2 sm:p-6 text-center">
                <div className="w-10 sm:w-16 h-10 sm:h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  {feature.icon}
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
