// app/about/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Truck,
  Shield,
  Users,
  Target,
  Heart,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "À Propos - ClickMarket",
  description:
    "Découvrez notre histoire, notre mission et notre engagement pour des produits frais et locaux.",
};

const values = [
  {
    icon: <Leaf className="h-8 w-8" />,
    title: "Fraîcheur Garantie",
    description: "Tous nos produits sont récoltés le jour même de la livraison",
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Qualité Supérieure",
    description: "Nous sélectionnons rigoureusement chaque produit",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Santé & Bien-être",
    description: "Des produits sains pour votre famille",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Communauté Locale",
    description: "Nous soutenons les producteurs de notre région",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Transparence Totale",
    description: "Vous savez d'où viennent vos produits",
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: "Livraison Éco-responsable",
    description: "Nous minimisons notre impact environnemental",
  },
];

const team = [
  {
    name: "Amadou Diop",
    role: "Fondateur & CEO",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400",
    bio: "15 ans d'expérience dans l'agroalimentaire",
  },
  {
    name: "Fatou Ndiaye",
    role: "Responsable Qualité",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400",
    bio: "Diplômée en nutrition et sécurité alimentaire",
  },
  {
    name: "Ibrahima Sarr",
    role: "Responsable Logistique",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400",
    bio: "Expert en chaîne d'approvisionnement",
  },
  {
    name: "Aïssatou Ba",
    role: "Responsable Client",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400",
    bio: "Passionnée par le service client",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-background dark:from-gray-900 dark:to-gray-950">
      <div className="page-container">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Notre{" "}
            <span className="text-green-600 dark:text-green-400">Histoire</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            ClickMarket est né d&apos;une passion pour les produits frais et
            d&apos;un désir de reconnecter les consommateurs avec les
            producteurs locaux. Notre mission : rendre accessible à tous des
            fruits et légumes de qualité.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              D&apos;où venons-nous ?
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Fondé en 2020 à Dakar, ClickMarket a commencé comme un petit
                projet familial avec une simple idée : fournir des produits
                frais directement des champs aux tables des familles
                sénégalaises.
              </p>
              <p>
                Aujourd&apos;hui, nous collaborons avec plus de 50 producteurs
                locaux et livrons dans 4 zones différentes, tout en restant
                fidèles à nos valeurs initiales.
              </p>
              <p>
                Notre croissance est le résultat de la confiance que nos clients
                nous accordent et de notre engagement inébranlable envers la
                qualité.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  50+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Producteurs locaux
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  10k+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Clients satisfaits
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  98%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Taux de satisfaction
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  24h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Livraison moyenne
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-900/50">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800"
                alt="Notre équipe"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 sm:-right-6 surface-card rounded-2xl p-4 sm:p-6 shadow-xl dark:shadow-gray-900/50 w-64">
              <div className="flex items-center gap-3 mb-3">
                <Award className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    Prix 2023
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Meilleure startup agro
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Récompensé pour notre innovation et notre impact social
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nos{" "}
            <span className="text-green-600 dark:text-green-400">Valeurs</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="shadow-lg dark:shadow-gray-900/50">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Notre{" "}
            <span className="text-green-600 dark:text-green-400">Équipe</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative h-64 w-64 mx-auto mb-4 rounded-2xl overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-green-600 dark:text-green-400 mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-linear-to-r from-green-600 to-emerald-500 dark:from-green-700 dark:to-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Prêt à découvrir la différence ClickMarket ?
          </h2>
          <p className="mb-6 text-green-100 dark:text-green-200 max-w-2xl mx-auto">
            Rejoignez des milliers de clients satisfaits qui ont choisi la
            fraîcheur et la qualité
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-card text-green-600 hover:bg-muted">
              Commander maintenant
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
