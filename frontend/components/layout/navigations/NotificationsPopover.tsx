"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, AlertCircle, Info, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotificationsPopover() {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Commande confirmée",
      message: "Votre commande #1001 a été confirmée.",
      timestamp: "Il y a 2h",
      icon: Check,
      unread: true,
    },
    {
      id: 2,
      type: "warning",
      title: "Livraison retardée",
      message: "Votre commande #1000 sera livrée demain.",
      timestamp: "Il y a 4h",
      icon: AlertCircle,
      unread: true,
    },
    {
      id: 3,
      type: "info",
      title: "Nouvelle promotion",
      message: "20% sur vos produits favoris.",
      timestamp: "Il y a 1j",
      icon: Info,
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:text-black hover:dark:hover:text-white hover:bg-green-500 dark:hover:bg-green-900"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="bg-destructive/90 text-destructive-foreground absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 bg-popover border border-border"
        align="end"
      >
        <div className="flex items-center justify-between p-4 border-bottom-default">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-destructive/10 dark:bg-destructive/20 text-destructive text-xs"
            >
              {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <ScrollArea className="h-80">
          <div className="space-y-1 p-2">
            {notifications.map((notif) => {
              const Icon = notif.icon;
              const colors = {
                success:
                  "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
                warning:
                  "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
                info: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
              };

              return (
                <div
                  key={notif.id}
                  className={`flex gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer ${
                    notif.unread ? "bg-muted/60" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg h-fit ${
                      colors[notif.type as keyof typeof colors]
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm leading-tight">
                        {notif.title}
                      </p>
                      {notif.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notif.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="border-top-default p-2">
          <Link href="/notifications">
            <Button
              variant="ghost"
              className="w-full justify-center text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-600 dark:hover:text-green-600 transition-colors hover:underline cursor-pointer"
            >
              Voir toutes les notifications
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
