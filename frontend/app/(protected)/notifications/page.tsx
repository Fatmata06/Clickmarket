"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Info } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Commande confirmée",
      message:
        "Votre commande #1001 a été confirmée et est en cours de préparation.",
      timestamp: "Il y a 2 heures",
      icon: Check,
    },
    {
      id: 2,
      type: "warning",
      title: "Livraison retardée",
      message:
        "Votre commande #1000 sera livrée demain au lieu de aujourd'hui.",
      timestamp: "Il y a 4 heures",
      icon: AlertCircle,
    },
    {
      id: 3,
      type: "info",
      title: "Nouvelle promotion",
      message:
        "Une nouvelle promotion de 20% est disponible sur vos produits favoris.",
      timestamp: "Il y a 1 jour",
      icon: Info,
    },
    {
      id: 4,
      type: "success",
      title: "Livraison effectuée",
      message: "Votre commande #999 a été livrée avec succès.",
      timestamp: "Il y a 2 jours",
      icon: Check,
    },
  ];

  return (
    <ProtectedLayout>
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Restez informé de vos activités
        </p>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          const colors = {
            success:
              "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
            warning:
              "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
            info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
          };

          const iconColors = {
            success: "text-green-600 dark:text-green-400",
            warning: "text-yellow-600 dark:text-yellow-400",
            info: "text-blue-600 dark:text-blue-400",
          };

          return (
            <Card
              key={notif.id}
              className={`border ${colors[notif.type as keyof typeof colors]}`}
            >
              <CardContent className="flex items-start gap-4 pt-6">
                <div
                  className={`p-2 rounded-lg ${
                    iconColors[notif.type as keyof typeof iconColors]
                  } bg-white/20 dark:bg-white/10`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{notif.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {notif.timestamp}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notif.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      </div>
    </ProtectedLayout>
  );
}
