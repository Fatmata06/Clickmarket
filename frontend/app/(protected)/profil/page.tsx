"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Edit } from "lucide-react";

export default function ProfilPage() {
  const { user } = useAuth()  || {
    prenom: "Jean",
    nom: "Dupont",
    email: "jean.dupont@example.com",
    role: "client",
  };

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mon Profil
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez vos informations personnelles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profil Info Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Informations Personnelles</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Prénom</Label>
                  <p className="text-lg font-semibold mt-2">{user?.prenom}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nom</Label>
                  <p className="text-lg font-semibold mt-2">{user?.nom}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <p className="text-lg font-semibold mt-2">{user?.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </Label>
                  <p className="text-lg font-semibold mt-2">
                    +221 77 XXX XX XX
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localisation
                  </Label>
                  <p className="text-lg font-semibold mt-2">Dakar, Sénégal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statut du Compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rôle</span>
                <span className="font-semibold capitalize bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Statut</span>
                <span className="font-semibold text-green-600">Actif</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Membre depuis</span>
                <span className="font-semibold">Jan 2024</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Adresses Sauvegardées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 flex items-start justify-between">
                <div>
                  <p className="font-semibold">Adresse de livraison</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    123 Rue de la République, Dakar, 18000
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Modifier
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}