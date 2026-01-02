// app/categories/page.tsx
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Leaf, TrendingUp, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Catégories - ClickMarket',
  description: 'Parcourez nos catégories de fruits et légumes frais. Bio, local, exotique et plus encore.',
}

const categories = [
  {
    id: 1,
    name: 'Fruits Frais',
    description: 'Une sélection de fruits de saison, cultivés localement',
    count: 152,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600',
    color: 'bg-orange-50 dark:bg-orange-950/20',
    icon: '🍎',
    popular: true
  },
  {
    id: 2,
    name: 'Légumes Bio',
    description: 'Légumes cultivés sans pesticides ni engrais chimiques',
    count: 98,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600',
    color: 'bg-green-50 dark:bg-green-950/20',
    icon: '🥕',
    popular: true
  },
  {
    id: 3,
    name: 'Produits Exotiques',
    description: 'Fruits et légumes exotiques importés avec soin',
    count: 45,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600',
    color: 'bg-purple-50 dark:bg-purple-950/20',
    icon: '🥭',
    popular: false
  },
  {
    id: 4,
    name: 'Paniers Prêts',
    description: 'Paniers préparés pour vos besoins spécifiques',
    count: 23,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600',
    color: 'bg-blue-50 dark:bg-blue-950/20',
    icon: '🧺',
    popular: true
  },
  {
    id: 5,
    name: 'Herbes & Épices',
    description: 'Herbes fraîches et épices pour relever vos plats',
    count: 67,
    image: 'https://res.cloudinary.com/ds5zfxlhf/image/upload/v1766798781/nadine-primeau--bLkT8wGV0I-unsplash_tpxkn3.jpg?auto=format&fit=crop&w=600',
    color: 'bg-yellow-50 dark:bg-yellow-950/20',
    icon: '🌿',
    popular: false
  },
  {
    id: 6,
    name: 'Jus & Smoothies',
    description: 'Jus frais et smoothies préparés quotidiennement',
    count: 34,
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600',
    color: 'bg-red-50 dark:bg-red-950/20',
    icon: '🧃',
    popular: false
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nos <span className="text-green-600 dark:text-green-400">Catégories</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez notre large sélection de produits frais, organisés par catégories pour faciliter vos achats
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg dark:shadow-gray-900/50 dark:bg-gray-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">300+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Produits frais</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg dark:shadow-gray-900/50 dark:bg-gray-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction client</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg dark:shadow-gray-900/50 dark:bg-gray-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">24h</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Livraison maximum</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.id}`}
              className="group block"
            >
              <Card className="border-0 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900 transition-all duration-300 overflow-hidden h-full dark:bg-gray-800">
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center text-2xl">
                      {category.icon}
                    </div>
                  </div>
                  {category.popular && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                        Populaire
                      </span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count} produits
                    </span>
                    <Button variant="ghost" size="sm" className="text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">
                      Voir tous
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Contactez-nous directement pour des demandes spéciales ou des produits spécifiques
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Contactez-nous
            </Button>
            <Button size="lg" variant="outline" className="px-8 dark:border-gray-600 dark:text-gray-300">
              Voir tous les produits
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}