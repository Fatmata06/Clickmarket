"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";

const orders = [
  {
    id: "1001",
    date: "15 Dec 2024",
    status: "livré",
    total: "45,000 FCFA",
    items: 3,
  },
  {
    id: "1000",
    date: "10 Dec 2024",
    status: "en cours",
    total: "32,500 FCFA",
    items: 2,
  },
  {
    id: "999",
    date: "5 Dec 2024",
    status: "livré",
    total: "28,000 FCFA",
    items: 1,
  },
];

const statusColors = {
  livré: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "en cours":
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  annulé: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function CommandesPage() {
  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mes Commandes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Suivez vos commandes
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-lg">
                      Commande #{order.id}
                    </h3>
                    <Badge
                      className={
                        statusColors[order.status as keyof typeof statusColors]
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-8 text-sm text-muted-foreground">
                    <div>
                      <span>Date</span>
                      <p className="font-semibold text-foreground">
                        {order.date}
                      </p>
                    </div>
                    <div>
                      <span>Articles</span>
                      <p className="font-semibold text-foreground">
                        {order.items}
                      </p>
                    </div>
                    <div>
                      <span>Total</span>
                      <p className="font-semibold text-foreground">
                        {order.total}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  );
}
