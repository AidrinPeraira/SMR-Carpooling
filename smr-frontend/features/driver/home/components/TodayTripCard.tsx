"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Tag, useToast } from "@sharemyride/ui";
import { Clock, Users, IndianRupee, Navigation, Eye } from "lucide-react";
import { DriverTodayTripResult, TripStatus } from "@sharemyride/shared";
import Link from "next/link";
import { startTripJourneyRequest } from "@/features/driver/journey/api/startTripJourneyRequest";

interface Props {
  trip: DriverTodayTripResult;
}

export function TodayTripCard({ trip }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [isStarting, setIsStarting] = useState(false);

  async function handleStartTrip() {
    try {
      setIsStarting(true);
      await startTripJourneyRequest(trip.trip_id);
      toast("Journey started successfully!", { variant: "success" });
      router.push(`/driver/journey/${trip.trip_id}`);
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to start journey",
        { variant: "error" },
      );
    } finally {
      setIsStarting(false);
    }
  }
  const startTime = new Date(trip.start_time);
  const formattedTime = startTime.toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const vacantSeats = trip.total_seats - trip.confirmed_seats;

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-content-primary">
            Today&apos;s Trip
          </h2>
          <Tag variant="accent">{trip.status.toUpperCase()}</Tag>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-border-strong">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-content-secondary uppercase tracking-wider block">
                Start Time
              </span>
              <span className="font-semibold text-content-primary">
                {formattedTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-content-secondary uppercase tracking-wider block">
                Available Seats
              </span>
              <span className="font-bold text-accent">
                {vacantSeats} / {trip.total_seats} Seats Vacant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center text-content-primary">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-content-secondary uppercase tracking-wider block">
                Estimated Earnings
              </span>
              <span className="font-bold text-content-primary">
                ₹{trip.estimated_earnings.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <div className="py-5 flex items-start gap-3">
          <div className="flex flex-col items-center pt-1">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <div className="w-0.5 h-10 bg-border-strong" />
            <div className="w-3 h-3 rounded-full border-2 border-accent" />
          </div>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs text-content-secondary font-medium block">
                Pickup Location
              </span>
              <span className="font-semibold text-content-primary">
                {trip.start_location.stop_name ||
                  trip.start_location.stop_address}
              </span>
            </div>
            <div>
              <span className="text-xs text-content-secondary font-medium block">
                Drop-off Destination
              </span>
              <span className="font-semibold text-content-primary">
                {trip.end_location.stop_name || trip.end_location.stop_address}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border-strong flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-content-secondary">
            <Users className="w-4 h-4 text-accent" />
            <span>{trip.confirmed_seats} confirmed passengers on board</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/driver/trips/${trip.trip_id}`}>
              <Button variant="secondary">Manage Trip</Button>
            </Link>
            {trip.status === TripStatus.ONGOING ? (
              <Link href={`/driver/journey/${trip.trip_id}`}>
                <Button className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  View Journey
                </Button>
              </Link>
            ) : (
              <Button
                className="flex items-center gap-1"
                disabled={isStarting}
                onClick={handleStartTrip}
              >
                <Navigation className="w-4 h-4" />
                {isStarting ? "Starting..." : "Start Trip"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
