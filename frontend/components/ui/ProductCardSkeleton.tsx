export default function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-muted" />

      <div className="p-4 space-y-3">
        {/* Category badge skeleton */}
        <div className="h-5 w-20 bg-muted rounded-full" />

        {/* Title skeleton */}
        <div className="h-6 w-3/4 bg-muted rounded" />

        {/* Price skeleton */}
        <div className="h-8 w-1/2 bg-muted rounded" />

        {/* Buttons skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-10 bg-muted rounded" />
          <div className="w-10 h-10 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProductsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
