import LoadingSpinner from "./LoadingSpinner";

interface ServerLoadingProps {
  message?: string;
  subMessage?: string;
}

export default function ServerLoading({
  message = "Chargement en cours...",
  subMessage = "Veuillez patienter pendant la connexion au serveur",
}: ServerLoadingProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-4 max-w-md">
        <LoadingSpinner />
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          {message}
        </p>
        {subMessage && (
          <p className="text-xs text-muted-foreground/60">{subMessage}</p>
        )}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50 mt-6">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-75" />
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150" />
          </div>
          <span>Connexion au serveur Render...</span>
        </div>
      </div>
    </div>
  );
}
