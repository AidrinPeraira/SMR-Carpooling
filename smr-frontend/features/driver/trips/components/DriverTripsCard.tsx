"use client";

import { useState } from "react";
import { Card, Tag, Avatar, Button } from "@sharemyride/ui";
import { CircleDot, MapPin, Users, CalendarX } from "lucide-react";
import { TripStatus } from "@sharemyride/shared";

export interface DisplayTrip {
  tripId: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime?: string;
  passengersCount: number;
  passengerAvatars?: string[];
  earnings: number;
  status: TripStatus;
}

interface DriverTripsCardProps {
  trips?: DisplayTrip[];
}

export function DriverTripsCard({ trips = [] }: DriverTripsCardProps) {
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">("all");

  const filteredTrips = trips.filter((t) => {
    if (filter === "completed") return t.status === TripStatus.COMPLETED;
    if (filter === "cancelled") return t.status === TripStatus.CANCELLED;
    return true;
  });

  const getStatusVariant = (status: TripStatus) => {
    switch (status) {
      case TripStatus.COMPLETED:
        return "accent";
      case TripStatus.CANCELLED:
        return "muted";
      default:
        return "muted";
    }
  };

  return (
    <Card className="p-5 md:p-6 flex flex-col gap-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-content-primary">Past Trips</h2>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-surface-muted p-1 rounded-full border border-border-strong w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-surface-card text-content-primary shadow-xs"
                : "text-content-secondary hover:text-content-primary"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
              filter === "completed"
                ? "bg-surface-card text-content-primary shadow-xs"
                : "text-content-secondary hover:text-content-primary"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
              filter === "cancelled"
                ? "bg-surface-card text-content-primary shadow-xs"
                : "text-content-secondary hover:text-content-primary"
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Trips list or Fallback */}
      {filteredTrips.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center gap-3 bg-surface-muted/40 rounded-xl border border-dashed border-border-subtle p-6">
          <CalendarX className="w-10 h-10 text-content-tertiary" />
          <h3 className="text-base font-semibold text-content-primary">
            No Trips Found
          </h3>
          <p className="text-xs text-content-secondary max-w-sm">
            {filter === "all"
              ? "No trip history available yet."
              : `There are currently no ${filter} trips to display.`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border-subtle border border-border-subtle rounded-xl overflow-hidden bg-surface-card">
          {filteredTrips.map((trip) => (
            <div
              key={trip.tripId}
              className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-base/50 transition-colors ${
                trip.status === TripStatus.CANCELLED ? "opacity-75" : ""
              }`}
            >
              {/* Route & Times */}
              <div className="flex gap-3 min-w-0 md:w-5/12">
                <div className="flex flex-col items-center justify-center pt-0.5 shrink-0">
                  <CircleDot className="w-4 h-4 text-accent" />
                  <div className="w-0.5 h-6 bg-border-strong my-1" />
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <div className="flex flex-col justify-between py-0.5 min-w-0">
                  <div>
                    <p className="text-sm font-semibold text-content-primary truncate">
                      {trip.origin}
                    </p>
                    <p className="text-xs text-content-secondary">
                      {trip.departureTime}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-content-primary truncate">
                      {trip.destination}
                    </p>
                    {trip.arrivalTime && (
                      <p className="text-xs text-content-secondary">
                        {trip.arrivalTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div className="flex items-center gap-2.5 md:w-3/12">
                <Users className="w-4 h-4 text-content-secondary shrink-0" />
                {trip.passengerAvatars && trip.passengerAvatars.length > 0 ? (
                  <div className="flex -space-x-2 overflow-hidden">
                    {trip.passengerAvatars.map((url, idx) => (
                      <Avatar
                        key={idx}
                        src={url}
                        size="sm"
                        className="ring-2 ring-surface-card"
                      />
                    ))}
                  </div>
                ) : null}
                <span className="text-xs text-content-secondary">
                  {trip.passengersCount} {trip.passengersCount === 1 ? "Passenger" : "Passengers"}
                </span>
              </div>

              {/* Earnings */}
              <div className="md:w-2/12">
                <p className="text-[10px] font-semibold text-content-secondary uppercase tracking-wider">
                  Earnings
                </p>
                <p className="text-lg font-bold text-accent">
                  ${trip.earnings.toFixed(2)}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex md:justify-end md:w-2/12">
                <Tag
                  variant={getStatusVariant(trip.status)}
                  className="capitalize font-semibold text-xs px-3 py-1"
                >
                  {trip.status.replace("_", " ")}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination / Load More */}
      {filteredTrips.length > 0 && (
        <div className="flex justify-center mt-2">
          <Button
            variant="secondary"
            className="rounded-full px-6 py-2 text-xs font-semibold"
          >
            Load More Trips
          </Button>
        </div>
      )}
    </Card>
  );
}

