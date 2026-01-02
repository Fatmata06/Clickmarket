'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

const categories = [
  {
    id: 1,
    name: 'Fruits Frais',
    count: 150,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400',
    color: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  {
    id: 2,
    name: 'Légumes Bio',
    count: 120,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400',
    color: 'bg-green-50',
    textColor: 'text-green-700'
  },
  {
    id: 3,
    name: 'Produits Exotiques',
    count: 80,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400',
    color: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
  {
    id: 4,
    name: 'Paniers Prêts',
    count: 45,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400',
    color: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
]

export default function CategoriesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="relative h-48">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  <p className="text-white/80">{category.count} produits</p>
                </div>
              </div>
              <div className={`p-4 ${category.color}`}>
                <Button className={`w-full justify-between ${category.textColor} cursor-pointer`}>
                  Voir tous
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}