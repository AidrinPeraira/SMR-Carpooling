"use client";

import { ApplicationCountCard } from "@/features/admin/dashboard/components/ApplicationCountCard";
import { LatestTransactionsTable } from "@/features/admin/dashboard/components/LatestTransactionsTable";
import { NewApplicationsTable } from "@/features/admin/dashboard/components/NewApplicationsTable";
import { RevenueTrendGraph } from "@/features/admin/dashboard/components/RevenueTrendGraph";
import { TransactionsCard } from "@/features/admin/dashboard/components/TransactionsCard";
import { TripsCountCard } from "@/features/admin/dashboard/components/TripsCountCard";
import { TripTrendGraph } from "@/features/admin/dashboard/components/TripTrendGraph";
import { UserCountCard } from "@/features/admin/dashboard/components/UserCountCard";

export function AdminDashboardView() {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-4 gap-4">
        <UserCountCard />
        <TripsCountCard />
        <ApplicationCountCard />
        <TransactionsCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TripTrendGraph />
        <RevenueTrendGraph />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <NewApplicationsTable />
        <LatestTransactionsTable />
      </div>
    </div>
  );
}
