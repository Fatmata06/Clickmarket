"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Search,
  LayoutDashboard,
  UserCircle,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function MobileMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const publicNavigation = [
    { name: "Accueil", href: "/" },
    { name: "Produits", href: "/produits" },
    { name: "Catégories", href: "/categories" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const authNavigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Produits", href: "/produits" },
    { name: "Catégories", href: "/categories" },
    { name: "Commandes", href: "/commandes" },
    { name: "Favoris", href: "/favoris" },
  ];

  const navigationToDisplay = isAuthenticated
    ? authNavigation
    : publicNavigation;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700 dark:text-gray-300"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher des produits..."
                className="pl-10 py-2 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-3 mb-3">
              Navigation
            </h3>
            {navigationToDisplay.map((item) => (
              <SheetClose key={item.name} asChild>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={
                      "cursor-pointer w-full hover:bg-primary hover:text-primary-foreground justify-start text-sm" +
                      (pathname === item.href
                        ? " font-semibold text-primary border-l-4 border-primary"
                        : "")
                    }
                  >
                    {item.name}
                  </Button>
                </Link>
              </SheetClose>
            ))}
          </nav>

          {/* User Section */}
          {isAuthenticated ? (
            <>
              {/* User Info Card */}
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <p className="font-semibold text-sm">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.email}
                </p>
              </div>

              {/* Account Section */}
              <div className="space-y-1 mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-3 mb-3">
                  Mon compte
                </h3>
                <SheetClose asChild>
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Tableau de bord
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/profil">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Mon profil
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/notifications">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                      <Badge className="bg-destructive/90 text-destructive-foreground ml-auto h-4 w-4 p-0 flex items-center justify-center text-xs">
                        2
                      </Badge>
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/parametres">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Button>
                  </Link>
                </SheetClose>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              {/* Login Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-3 mb-3">
                  Compte
                </h3>
                <SheetClose asChild>
                  <Link href="/login" className="block">
                    <Button
                      variant="outline"
                      className="cursor-pointer w-full justify-start text-sm font-semibold hover:bg-muted hover:text-foreground"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Se connecter
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/register" className="block">
                    <Button
                      variant="outline"
                      className="cursor-pointer w-full justify-start text-sm font-semibold hover:bg-muted hover:text-foreground"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      S&apos;inscrire
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </>
          )}

          {/* Theme Preference */}
          <div className="mt-6 pt-6 border-top-default">
            <div className="flex items-center justify-between px-3">
              <span className="text-sm font-medium">Thème</span>
              <ModeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
