"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MapPin,
  Phone,
  LogOut,
  Settings,
  LayoutDashboard,
  UserCircle,
  LogIn,
  UserPlus,
  User,
} from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import CartSheet from "./CartSheet";
import MobileMenu from "./MobileMenu";
import NotificationsPopover from "./NotificationsPopover";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
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
    <>
      <header className="sticky top-0 z-50 w-full border-bottom-default bg-card/80 backdrop-blur-md">
        {/* Top Bar */}
        <div className="bg-green-600 dark:bg-green-800 text-white py-2 px-2 sm:px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>+221 33 123 45 67</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Livraison dans 4 zones</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span>Livraison gratuite à partir de 10 000 FCFA</span>
              <Badge variant="secondary" className="bg-card/20 text-white">
                Nouveau
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link
                href={isAuthenticated ? "/dashboard" : "/"}
                className="flex items-center"
              >
                <div className="relative w-40 h-20">
                  <Image
                    src="/logo.png"
                    alt="ClickMarket Logo"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 192px"
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                {navigationToDisplay.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium ${
                      pathname === item.href
                        ? "text-green-600 dark:text-green-400 font-semibold"
                        : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Actions - Desktop */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Desktop Search - Icône seulement par défaut */}
                <div className="hidden lg:flex items-center">
                  <AnimatePresence>
                    {isSearchOpen ? (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{
                          opacity: 1,
                          width: window.innerWidth <= 1024 ? "155px" : "220px",
                        }}
                        exit={{ opacity: 0, width: 0 }}
                        className="relative overflow-hidden"
                      >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                          type="search"
                          placeholder="Rechercher des produits..."
                          className="pl-10 bg-muted border-0 w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSearch(searchQuery);
                            }
                          }}
                          autoFocus
                          onBlur={() => setIsSearchOpen(false)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, width: "40px" }}
                        animate={{ opacity: 1, width: "40px" }}
                        exit={{ opacity: 0, width: "40px" }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-black hover:dark:hover:text-white hover:bg-green-500 dark:hover:bg-green-900"
                          onClick={() => setIsSearchOpen(true)}
                        >
                          <Search className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Theme Toggle */}
                <ModeToggle />

                {/* Notifications - Only for authenticated users */}
                {isAuthenticated && <NotificationsPopover />}

                {/* User Menu - Authenticated */}
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-black hover:dark:hover:text-white hover:bg-green-500 dark:hover:bg-green-900"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col hover:bg-muted p-2 rounded-md">
                          <span className="font-semibold">
                            {user?.prenom} {user?.nom}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Tableau de bord
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profil" className="cursor-pointer">
                          <UserCircle className="mr-2 h-4 w-4" />
                          Mon profil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/parametres" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Paramètres
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 dark:text-red-400"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  /* User Menu - Not Authenticated */
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-black hover:dark:hover:text-white hover:bg-green-500 dark:hover:bg-green-900"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="cursor-pointer">
                          <LogIn className="mr-2 h-4 w-4" />
                          Se connecter
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/register" className="cursor-pointer">
                          <UserPlus className="mr-2 h-4 w-4" />
                          S&apos;inscrire
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Cart Sheet */}
                <CartSheet />
              </div>

              {/* Actions - Mobile */}
              <div className="flex lg:hidden items-center gap-2">
                {/* Cart Sheet on Mobile */}
                <CartSheet />

                {/* Mobile Menu */}
                <MobileMenu />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
