'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Search, ShoppingCart, Truck, CreditCard } from 'lucide-react'

const steps = [
  {
    icon: <Search className="h-8 w-8" />,
    title: "Parcourir",
    description: "Explorez notre large sélection de fruits et légumes frais"
  },
  {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "Ajouter au panier",
    description: "Sélectionnez vos produits préférés et ajoutez-les au panier"
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Payer",
    description: "Choisissez votre mode de paiement (Wave, Orange Money, Espèces)"
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: "Livraison",
    description: "Recevez votre commande fraîche à domicile dans les 24h"
  }
]

export default function HowItWorks() {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Comment ça <span className="text-green-600 dark:text-green-400">fonctionne</span>
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="shadow-lg hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-300 h-full">
              <CardContent className="p-2 sm:p-6 text-center">
                <div className="relative mb-6">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 dark:bg-green-700 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-md sm:text-lg md:text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">{step.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}