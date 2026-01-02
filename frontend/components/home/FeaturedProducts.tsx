'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

const products = [
  {
    id: 1,
    name: 'Pommes Golden Bio',
    category: 'Fruits',
    price: 2500,
    originalPrice: 3000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=400',
    badge: 'BIO'
  },
  {
    id: 2,
    name: 'Carottes Fraîches',
    category: 'Légumes',
    price: 1500,
    originalPrice: null,
    rating: 4.5,
    image: 'https://res.cloudinary.com/ds5zfxlhf/image/upload/v1766754223/k8-GHRT9j21m2M-unsplash_aklg6f.jpg?auto=format&fit=crop&w=400',
    badge: 'LOCAL'
  },
  {
    id: 3,
    name: 'Avocats Hass',
    category: 'Fruits',
    price: 1200,
    originalPrice: 1500,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400',
    badge: 'PROMO'
  },
  {
    id: 4,
    name: 'Salade Laitue',
    category: 'Légumes',
    price: 800,
    originalPrice: null,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400',
    badge: 'FRAIS'
  },
]

export default function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="p-0 relative overflow-hidden m-0">
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover block"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <Badge className="absolute top-3 left-3 bg-green-800  text-white">
                  {product.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                  <h3 className="font-semibold text-lg dark:text-white">{product.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium dark:text-gray-300">{product.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {product.price.toLocaleString()} FCFA
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                    {product.originalPrice.toLocaleString()} FCFA
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full gap-2 bg-green-700 hover:bg-green-600 text-white">
                <ShoppingCart className="h-4 w-4" />
                Ajouter au panier
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}