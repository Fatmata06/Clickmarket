'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

export default function Newsletter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative rounded-2xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-700 dark:to-emerald-600" />
      <div className="relative px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Restez informé des nouveautés
          </h2>
          <p className="text-green-100 dark:text-green-200 mb-8 text-lg">
            Inscrivez-vous à notre newsletter pour recevoir nos offres spéciales et conseils
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse email"
              className="bg-white/10 dark:bg-gray-900/30 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm dark:placeholder:text-gray-300"
            />
            <Button type="submit" className="gap-2 bg-white text-green-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
              <Send className="h-4 w-4" />
              S&apos;inscrire
            </Button>
          </form>
          
          <p className="text-green-200 dark:text-green-300 text-sm mt-4">
            En vous inscrivant, vous acceptez notre politique de confidentialité
          </p>
        </div>
      </div>
    </motion.div>
  )
}