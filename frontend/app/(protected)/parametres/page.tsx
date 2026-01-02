"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Lock, Eye, Trash2 } from "lucide-react";

export default function ParametresPage() {
  return (
    <ProtectedLayout>
      <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Paramètres
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gérez vos préférences et votre sécurité
        </p>
      </div>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">
                Notifications par email
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Recevez des mises à jour sur vos commandes
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="border-t pt-6 flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">
                Notifications promotionnelles
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Recevez les meilleures offres et promotions
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="border-t pt-6 flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">
                Notifications SMS
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Recevez les alertes importantes par SMS
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Confidentialité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Profil Public</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Autorisez les autres à voir votre profil
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="border-t pt-6 flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">
                Afficher les achats
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Autorisez les autres à voir votre historique d&apos;achats
              </p>
            </div>
            <Switch />
          </div>

          <div className="border-t pt-6 flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">
                Avis et Commentaires
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Autorisez les avis publics sur vos achats
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start h-auto p-4">
            <Lock className="h-5 w-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Changer le mot de passe</p>
              <p className="text-sm text-muted-foreground">
                Mettez à jour votre mot de passe régulièrement
              </p>
            </div>
          </Button>

          <Button variant="outline" className="w-full justify-start h-auto p-4">
            <Lock className="h-5 w-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Authentification à deux facteurs</p>
              <p className="text-sm text-muted-foreground">
                Ajoutez une couche de sécurité supplémentaire
              </p>
            </div>
          </Button>

          <Button variant="outline" className="w-full justify-start h-auto p-4">
            <Eye className="h-5 w-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Sessions actives</p>
              <p className="text-sm text-muted-foreground">
                Gérez vos connexions sur d&apos;autres appareils
              </p>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            Zone Dangereuse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="w-full justify-start h-auto p-4"
          >
            <Trash2 className="h-5 w-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Supprimer le compte</p>
              <p className="text-sm">
                Supprimez définitivement votre compte et toutes vos données
              </p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
    </ProtectedLayout>
  );
}
