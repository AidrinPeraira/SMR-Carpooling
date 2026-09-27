"use client";

import Link from "next/link";
import { Card, Tag, Button } from "@sharemyride/ui";
import { TodayTripResult, TripStatus } from "@sharemyride/shared";
import { CircleDot, MapPin, Clock, Users } from "lucide-react";

interface DriverOverviewActiveTripCardProps {
  trip: TodayTripResult | null;
}

export function DriverOverviewActiveTripCard({
  trip,
}: DriverOverviewActiveTripCardProps) {
  if (!trip) {
    return (
      <Card className="p-5 md:p-6 shadow-xs">
        <h2 className="text-xl font-bold text-content-primary mb-4">
          Today&apos;s Trip
        </h2>
        <p className="text-sm text-content-secondary">
          No active trips for today.
        </p>
      </Card>
    );
  }

  const formattedTime = new Date(trip.start_time).toLocaleTimeString(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const statusLabel =
    trip.trip_status === TripStatus.ONGOING
      ? "Ongoing"
      : trip.trip_status === TripStatus.FULLY_BOOKED
        ? "Fully Booked"
        : "Scheduled";

  const statusClass =
    trip.trip_status === TripStatus.ONGOING
      ? "bg-success-surface text-success-content border-success-border"
      : trip.trip_status === TripStatus.FULLY_BOOKED
        ? "bg-warning-surface text-warning-content border-warning-border"
        : "bg-accent/15 text-accent border-accent/30";

  return (
    <Card className="p-5 md:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-xl font-bold text-content-primary">
          Today&apos;s Trip
        </h2>
        <Tag variant="accent" className={`font-semibold text-xs ${statusClass}`}>
          {statusLabel}
        </Tag>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex gap-3 flex-1 min-w-0">
          <div className="flex flex-col items-center pt-0.5 shrink-0">
            <CircleDot className="w-4 h-4 text-accent" />
            <div className="w-0.5 h-8 bg-border-strong my-1" />
            <MapPin className="w-4 h-4 text-accent" />
          </div>
          <div className="flex flex-col justify-between py-0.5 min-w-0">
            <p className="text-sm font-semibold text-content-primary truncate">
              {trip.origin}
            </p>
            <p className="text-sm font-semibold text-content-primary truncate mt-4">
              {trip.destination}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-content-secondary">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span className="font-medium">
              {trip.vacant_seats}/{trip.total_seats} seats
            </span>
          </div>
        </div>

        <Link href={`/driver/trips/${trip.trip_id}`}>
          <Button variant="secondary" className="text-xs py-2 px-4">
            View Trip →
          </Button>
        </Link>
      </div>
    </Card>
  );
}
