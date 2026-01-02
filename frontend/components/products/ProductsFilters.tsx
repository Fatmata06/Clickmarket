// components/products/ProductsFilters.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Star } from 'lucide-react'

export default function ProductsFilters() {
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [categories, setCategories] = useState<string[]>([])
  const [rating, setRating] = useState<number | null>(null)

  const filters = [
    {
      title: 'Catégories',
      options: [
        { label: 'Fruits', value: 'fruits', count: 85 },
        { label: 'Légumes', value: 'vegetables', count: 67 },
        { label: 'Bio', value: 'organic', count: 42 },
        { label: 'Local', value: 'local', count: 58 },
        { label: 'Exotique', value: 'exotic', count: 23 },
      ]
    },
    {
      title: 'Disponibilité',
      options: [
        { label: 'En stock', value: 'in-stock', count: 142 },
        { label: 'Bientôt disponible', value: 'coming-soon', count: 10 },
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Prix (FCFA)</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 10000]}
            max={20000}
            step={500}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-4"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{priceRange[0].toLocaleString()} FCFA</span>
          <span>{priceRange[1].toLocaleString()} FCFA</span>
        </div>
      </div>

      {/* Filters */}
      {filters.map((filter) => (
        <div key={filter.title}>
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">
            {filter.title}
          </h3>
          <div className="space-y-3">
            {filter.options.map((option) => (
              <div key={option.value} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={categories.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCategories([...categories, option.value])
                      } else {
                        setCategories(categories.filter(c => c !== option.value))
                      }
                    }}
                  />
                  <Label
                    htmlFor={option.value}
                    className="text-sm font-normal text-gray-700 dark:text-gray-300"
                  >
                    {option.label}
                  </Label>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({option.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Rating */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Notes</h3>
        <div className="space-y-2">
          {[5, 4, 3].map((stars) => (
            <Button
              key={stars}
              variant="ghost"
              size="sm"
              className={`w-full justify-start ${rating === stars ? 'bg-green-100 dark:bg-green-900 hover:bg-green-900 cursor-pointer dark:hover:bg-green-800' : 'cursor-pointer'}`}
              onClick={() => setRating(rating === stars ? null : stars)}
            >
              <div className="flex items-center gap-2">
                {[...Array(stars)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  & plus
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <Button className="w-full bg-green-600 text-white hover:bg-green-700">Appliquer les filtres</Button>
    </div>
  )
}