export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-green-200 dark:border-green-800"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-green-600 dark:border-green-400 border-t-transparent animate-spin"></div>
      </div>
    </div>
  )
}