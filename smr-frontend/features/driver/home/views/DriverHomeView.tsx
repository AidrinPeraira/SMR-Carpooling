"use client";

import { useQuery } from "@tanstack/react-query";
import { getDriverOverviewRequest } from "../api/getDriverOvervieRequest";
import { DriverOverviewStatsCard } from "../components/DriverOverviewStatsCard";
import { DriverOverviewActiveTripCard } from "../components/DriverOverviewActiveTripCard";
import { DriverOverviewBookingsCard } from "../components/DriverOverviewBookingsCard";
import { DriverOverviewVehicleCard } from "../components/DriverOverviewVehicleCard";
import { Button, Loader, Tag } from "@sharemyride/ui";
import { DriverStatus } from "@sharemyride/shared";
import { AlertTriangle } from "lucide-react";

export function DriverHomeView() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["driverOverview"],
    queryFn: getDriverOverviewRequest,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader />
        <p className="text-sm text-content-secondary animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-error-border bg-error-surface p-6 text-center text-error-content my-8 mx-4">
        <h3 className="font-semibold text-lg">Error Loading Dashboard</h3>
        <p className="text-sm mt-1">
          {(error as Error)?.message || "Failed to load overview."}
        </p>
        <Button
          variant="secondary"
          className="mt-4 text-xs py-1.5 px-3"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl flex flex-col gap-6">
      {data.driver_status !== DriverStatus.ACTIVE && (
        <div className="flex items-center gap-3 rounded-xl border border-warning-border bg-warning-surface p-4">
          <AlertTriangle className="w-5 h-5 text-warning-content shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning-content">
              Account Status:{" "}
              <Tag
                variant="muted"
                className="bg-warning-surface text-warning-content border-warning-border ml-1"
              >
                {data.driver_status.toUpperCase()}
              </Tag>
            </p>
            <p className="text-xs text-warning-content/80 mt-0.5">
              Your account is not active. Some features may be restricted.
            </p>
          </div>
        </div>
      )}

      <DriverOverviewStatsCard stats={data.stats} />

      <DriverOverviewActiveTripCard trip={data.today_trip ?? null} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DriverOverviewBookingsCard bookings={data.recent_bookings} />
        </div>
        <div>
          {data.active_vehicle ? (
            <DriverOverviewVehicleCard vehicle={data.active_vehicle} />
          ) : (
            <div className="rounded-xl border border-border-subtle bg-surface-card p-6 text-center shadow-xs">
              <p className="text-sm font-semibold text-content-primary">
                No Active Vehicle
              </p>
              <p className="text-xs text-content-secondary mt-1">
                Register a vehicle to start creating trips.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
