"use client";

import { Card, Button } from "@sharemyride/ui";
import { CircleDot, MapPin, Clock, Users, CalendarX, Navigation } from "lucide-react";

export interface ActiveTrip {
  tripId: string;
  origin: string;
  destination: string;
  startTime: string;
  passengersCount: number;
}

interface ActiveTripCardProps {
  activeTrip?: ActiveTrip | null;
  onStartTrip?: (tripId: string) => void;
}

export function ActiveTripCard({ activeTrip, onStartTrip }: ActiveTripCardProps) {
  return (
    <Card className="p-5 flex flex-col gap-4 shadow-xs">
      <div>
        <h2 className="text-lg font-semibold text-content-primary">
          Today's Trip
        </h2>
        <p className="text-xs text-content-secondary mt-1">
          Your next scheduled ride.
        </p>
      </div>

      {!activeTrip ? (
        <div className="py-6 flex flex-col items-center justify-center text-center gap-2 bg-surface-muted/50 rounded-lg border border-dashed border-border-subtle p-4">
          <CalendarX className="w-8 h-8 text-content-tertiary" />
          <p className="text-sm font-medium text-content-primary">
            No Active Trip Today
          </p>
          <p className="text-xs text-content-secondary">
            You don't have any scheduled rides remaining for today.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <CircleDot className="w-4 h-4 text-accent shrink-0" />
              <span className="text-sm font-semibold text-content-primary truncate">
                {activeTrip.origin}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span className="text-sm font-semibold text-content-primary truncate">
                {activeTrip.destination}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 text-content-secondary">
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeTrip.startTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5" />
                <span>{activeTrip.passengersCount} Passengers</span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => onStartTrip?.(activeTrip.tripId)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold"
          >
            <Navigation className="w-4 h-4" />
            <span>Start Now</span>
          </Button>
        </div>
      )}
    </Card>
  );
}

