"use client";

import { Tag } from "@sharemyride/ui";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TotalBookingsCard } from "../components/TotalBookingsCard";
import { WalletBalanceCard } from "../components/WalletBalanceCard";
import { PassengerTodayTripCard } from "../components/PassengerTodayTripCard";
import { PassengerRecentBookingsCard } from "../components/PassengerRecentBookingsCard";
import { QuickShortcutsCard } from "../components/QuickShortcutsCard";
import { getPassengerBookingStatsRequest } from "../api/getPassengerBookingStatsRequest";
import { getPassengerTodayTripRequest } from "../api/getPassengerTodayTripRequest";
import { getPassengerRecentBookingsRequest } from "../api/getPassengerRecentBookingsRequest";
import { getPassengerWalletBalanceRequest } from "../api/getPassengerWalletBalanceRequest";
import Link from "next/link";

export function PassengerHomeView() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["passengerBookingStats"],
    queryFn: getPassengerBookingStatsRequest,
  });

  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ["passengerWalletBalance"],
    queryFn: getPassengerWalletBalanceRequest,
  });

  const { data: todayTrip, isLoading: tripLoading } = useQuery({
    queryKey: ["passengerTodayTrip"],
    queryFn: getPassengerTodayTripRequest,
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["passengerRecentBookings"],
    queryFn: getPassengerRecentBookingsRequest,
  });

  const isStatsLoading = statsLoading || walletLoading;

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
              <Tag variant="muted" className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Passenger
              </Tag>
            </div>
          </div>
          <Link href="/passenger/trips">
            <button className="flex items-center gap-1 bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors">
              <Search className="w-4 h-4" />
              Find a Ride
            </button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isStatsLoading ? (
            <>
              <div className="h-24 bg-surface-muted rounded-lg animate-pulse" />
              <div className="h-24 bg-surface-muted rounded-lg animate-pulse" />
            </>
          ) : (
            <>
              {stats && <TotalBookingsCard stats={stats} />}
              {walletData && (
                <WalletBalanceCard balance={walletData.wallet_balance} />
              )}
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
            <PassengerTodayTripCard trip={todayTrip} />
          ) : (
            <section>
              <h2 className="text-xl font-semibold text-content-primary mb-4">
                Today&apos;s Trip
              </h2>
              <div className="rounded-lg border border-border-strong p-8 text-center text-content-secondary">
                No trips booked for today.
              </div>
            </section>
          )}

          {bookingsLoading ? (
            <div className="h-48 bg-surface-muted rounded-lg animate-pulse" />
          ) : bookingsData?.data && bookingsData.data.length > 0 ? (
            <PassengerRecentBookingsCard bookings={bookingsData.data} />
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
