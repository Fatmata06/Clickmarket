"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import UnifiedDashboard from "./UnifiedDashboard";

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <UnifiedDashboard />
    </ProtectedLayout>
  );
}
