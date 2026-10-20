import { ApplicationCountCard } from "@/features/admin/dashboard/components/ApplicationCountCard";
import { NewApplicationsTable } from "@/features/admin/dashboard/components/NewApplicationsTable";
import { RevenueTrendGraph } from "@/features/admin/dashboard/components/RevenueTrendGraph";
import { TransactionsCard } from "@/features/admin/dashboard/components/TransactionsCard";
import { TripsCountCard } from "@/features/admin/dashboard/components/TripsCountCard";
import { TripTrendGraph } from "@/features/admin/dashboard/components/TripTrendGraph";
import { UserCountCard } from "@/features/admin/dashboard/components/UserCountCard";

export function AdminDashboardView() {
  return (
    <div>
      <div>
        <UserCountCard />
        <TripsCountCard />
        <ApplicationCountCard />
        <TransactionsCard />
      </div>
      <div>
        <TripTrendGraph />
        <RevenueTrendGraph />
      </div>
      <RevenueTrendGraph />
      <NewApplicationsTable />
    </div>
  );
}
