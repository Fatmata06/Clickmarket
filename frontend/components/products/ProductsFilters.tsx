// components/products/ProductsFilters.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";

interface ProductsFiltersProps {
  priceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
  categories: string[];
  onCategoriesChange: (value: string[]) => void;
  rating: number | null;
  onRatingChange: (value: number | null) => void;
  availability: string[];
  onAvailabilityChange: (value: string[]) => void;
}

export default function ProductsFilters({
  priceRange,
  onPriceRangeChange,
  categories,
  onCategoriesChange,
  rating,
  onRatingChange,
  availability,
  onAvailabilityChange,
}: ProductsFiltersProps) {
  const filters = [
    {
      title: "Catégories",
      options: [
        { label: "Fruits", value: "fruits" },
        { label: "Légumes", value: "legumes" },
      ],
    },
    {
      title: "Disponibilité",
      options: [
        { label: "En stock", value: "in-stock" },
        { label: "Bientôt disponible", value: "coming-soon" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Prix (FCFA)
        </h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 10000]}
            max={20000}
            step={500}
            value={priceRange}
            onValueChange={onPriceRangeChange}
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
            {filter.options.map((option) => {
              const isCategory = filter.title === "Catégories";
              const selected = isCategory
                ? categories.includes(option.value)
                : availability.includes(option.value);

              return (
                <div
                  key={option.value}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={selected}
                      onCheckedChange={(checked) => {
                        if (isCategory) {
                          const next = checked
                            ? [...categories, option.value]
                            : categories.filter((c) => c !== option.value);
                          onCategoriesChange(next);
                        } else {
                          const next = checked
                            ? [...availability, option.value]
                            : availability.filter((c) => c !== option.value);
                          onAvailabilityChange(next);
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
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Rating */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Notes
        </h3>
        <div className="space-y-2">
          {[5, 4, 3].map((stars) => (
            <Button
              key={stars}
              variant="ghost"
              size="sm"
              className={`w-full justify-start ${
                rating === stars
                  ? "bg-green-100 dark:bg-green-900 hover:bg-green-900 cursor-pointer dark:hover:bg-green-800"
                  : "cursor-pointer"
              }`}
              onClick={() => onRatingChange(rating === stars ? null : stars)}
            >
              <div className="flex items-center gap-2">
                {[...Array(stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
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
      <Button className="w-full bg-green-600 text-white hover:bg-green-700">
        Appliquer les filtres
      </Button>
    </div>
  );
}
