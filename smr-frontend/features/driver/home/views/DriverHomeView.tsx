"use client";

import { Button, Tag } from "@sharemyride/ui";
import { PlusCircle, BadgeCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TotalTripsCard } from "../components/TotalTripsCard";
import { TotalEarningsCard } from "../components/TotalEarningsCard";
import { TotalPassengersCard } from "../components/TotalPassengersCard";
import { TodayTripCard } from "../components/TodayTripCard";
import { RecentBookingsCard } from "../components/RecentBookingsCard";
import { QuickShortcutsCard } from "../components/QuickShortcutsCard";
import { getDriverTripStatsRequest } from "../api/getDriverTripStatsRequest";
import { getDriverEarningsRequest } from "../api/getDriverEarningsRequest";
import { getDriverTodayTripRequest } from "../api/getDriverTodayTripRequest";
import { getDriverRecentBookingsRequest } from "../api/getDriverRecentBookingsRequest";

export function DriverHomeView() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["driverTripStats"],
    queryFn: getDriverTripStatsRequest,
  });

  const { data: earnings, isLoading: earningsLoading } = useQuery({
    queryKey: ["driverEarnings"],
    queryFn: getDriverEarningsRequest,
  });

  const { data: todayTrip, isLoading: tripLoading } = useQuery({
    queryKey: ["driverTodayTrip"],
    queryFn: getDriverTodayTripRequest,
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["driverRecentBookings"],
    queryFn: getDriverRecentBookingsRequest,
  });

  const isStatsLoading = statsLoading || earningsLoading;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
      {/* Hero Welcome */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-semibold text-content-primary">
                Welcome back!
              </h1>
              <Tag variant="accent" className="flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                Verified Driver
              </Tag>
              <Tag variant="muted" className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Active
              </Tag>
            </div>
          </div>
          <Button className="flex items-center gap-1">
            <PlusCircle className="w-4 h-4" />
            Offer a Ride
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isStatsLoading ? (
            <>
              <div className="h-24 bg-surface-muted rounded-lg animate-pulse" />
              <div className="h-24 bg-surface-muted rounded-lg animate-pulse" />
              <div className="h-24 bg-surface-muted rounded-lg animate-pulse" />
            </>
          ) : (
            <>
              {stats && <TotalTripsCard stats={stats} />}
              {earnings && <TotalEarningsCard earnings={earnings} />}
              {stats && <TotalPassengersCard stats={stats} />}
            </>
          )}
        </div>
      </section>

      {/* Bento grid: main + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-8">
          {tripLoading ? (
            <div className="h-64 bg-surface-muted rounded-lg animate-pulse" />
          ) : todayTrip ? (
            <TodayTripCard trip={todayTrip} />
          ) : (
            <section>
              <h2 className="text-xl font-semibold text-content-primary mb-4">
                Today&apos;s Trip
              </h2>
              <div className="rounded-lg border border-border-strong p-8 text-center text-content-secondary">
                No trips scheduled for today.
              </div>
            </section>
          )}

          {bookingsLoading ? (
            <div className="h-48 bg-surface-muted rounded-lg animate-pulse" />
          ) : bookingsData?.data && bookingsData.data.length > 0 ? (
            <RecentBookingsCard bookings={bookingsData.data} />
          ) : (
            <section>
              <h2 className="text-xl font-semibold text-content-primary mb-4">
                Recent Bookings
              </h2>
              <div className="rounded-lg border border-border-strong p-8 text-center text-content-secondary">
                No recent bookings.
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-6">
          <QuickShortcutsCard />
        </aside>
      </div>
    </div>
  );
}
