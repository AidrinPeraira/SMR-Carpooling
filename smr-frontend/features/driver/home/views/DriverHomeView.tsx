"use client";

import { Button, Tag } from "@sharemyride/ui";
import { PlusCircle, BadgeCheck } from "lucide-react";
import { TotalTripsCard } from "../components/TotalTripsCard";
import { TotalEarningsCard } from "../components/TotalEarningsCard";
import { TotalPassengersCard } from "../components/TotalPassengersCard";
import { TodayTripCard } from "../components/TodayTripCard";
import { RecentBookingsCard } from "../components/RecentBookingsCard";
import { QuickShortcutsCard } from "../components/QuickShortcutsCard";

const mockBookings = [
  {
    id: "BK-8842",
    passengerName: "Sarah Jenkins",
    passengerInitials: "SJ",
    bookedAt: "Today, 2:15 PM",
    routeFrom: "Downtown Seattle",
    routeTo: "Bellevue Transit Ctr",
    seats: 1,
    status: "pending" as const,
    fare: 1800,
  },
  {
    id: "BK-8839",
    passengerName: "David Chen",
    passengerInitials: "DC",
    bookedAt: "Today, 1:40 PM",
    routeFrom: "Pioneer Square",
    routeTo: "Redmond Campus",
    seats: 1,
    status: "confirmed" as const,
    fare: 2450,
  },
  {
    id: "BK-8820",
    passengerName: "Michael Torres",
    passengerInitials: "MT",
    bookedAt: "Yesterday, 6:00 PM",
    routeFrom: "Capitol Hill",
    routeTo: "Kirkland Urban",
    seats: 2,
    status: "completed" as const,
    fare: 3200,
  },
];

export function DriverHomeView() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
      {/* Hero Welcome */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-semibold text-content-primary">
                Welcome back, Marcus!
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
            <p className="text-content-secondary">
              You have 1 scheduled trip and 3 pending booking requests today.
            </p>
          </div>
          <Button className="flex items-center gap-1">
            <PlusCircle className="w-4 h-4" />
            Offer a Ride
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TotalTripsCard totalTrips={142} monthlyGrowth={12} />
          <TotalEarningsCard
            totalEarnings={284050}
            payoutStatus="Ready for payout"
          />
          <TotalPassengersCard totalPassengers={318} averageRating={4.95} />
        </div>
      </section>

      {/* Bento grid: main + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <TodayTripCard
            startTime="Today, 05:30 PM"
            availableSeats={2}
            totalSeats={4}
            estimatedFare={2400}
            pickupLocation="Downtown Seattle - 4th Ave & Pike St"
            dropoffLocation="Bellevue Transit Center - Bay 3"
            confirmedPassengers={2}
            departureIn="40 mins"
          />
          <RecentBookingsCard bookings={mockBookings} />
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-6">
          <QuickShortcutsCard />
        </aside>
      </div>
    </div>
  );
}
