'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: "Marie Diop",
    role: "Client régulier",
    content: "Les produits sont toujours frais et la livraison est rapide. Je recommande !",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100"
  },
  {
    id: 2,
    name: "Abdoulaye Ndiaye",
    role: "Restaurateur",
    content: "Qualité exceptionnelle pour mes besoins professionnels. Service impeccable.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100"
  },
  {
    id: 3,
    name: "Aïssatou Ba",
    role: "Maman de famille",
    content: "Pratique et économique. Mes enfants adorent les fruits frais de ClickMarket.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100"
  }
]

export default function Testimonials() {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Ce que disent nos <span className="text-green-600 dark:text-green-400">clients</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-300 h-full dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 italic">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="50px"
                    />
                  </div>
                  <div>
                    <h4 className="text-md md:text-lg font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}