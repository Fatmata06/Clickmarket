"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import DashboardClient from "./dashboardClient";
import DashboardAdmin from "./dashboardAdmin";
import DashboardFournisseur from "./dashboardFournisseur";




export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, hasRole, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !user) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tableau de bord {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Bienvenue, {user.prenom} {user.nom}!
          </p>
        </div> */}

        {hasRole("admin") && <DashboardAdmin />}
        {hasRole("client") && <DashboardClient />}
        {hasRole("fournisseur") && <DashboardFournisseur />}
      </div>
    </ProtectedLayout>
  );
}
