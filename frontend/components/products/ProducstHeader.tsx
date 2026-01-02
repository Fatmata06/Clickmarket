// components/products/ProductsHeader.tsx
export default function ProductsHeader() {
  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Nos <span className="text-green-600 dark:text-green-400">Produits</span>
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Découvrez notre sélection de fruits et légumes frais, soigneusement sélectionnés pour leur qualité.
      </p>
    </div>
  )
}