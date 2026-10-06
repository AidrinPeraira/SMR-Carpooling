import { Card, Button, Tag } from "@sharemyride/ui";
import { Clock, Car, IndianRupee, Users } from "lucide-react";
import { PassengerTodayTripResult } from "@sharemyride/shared";
import Link from "next/link";

interface Props {
  trip: PassengerTodayTripResult;
}

export function PassengerTodayTripCard({ trip }: Props) {
  const startTime = new Date(trip.trip_start_time);
  const formattedTime = startTime.toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

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
                Departure
              </span>
              <span className="font-semibold text-content-primary">
                {formattedTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-content-secondary uppercase tracking-wider block">
                Vehicle
              </span>
              <span className="font-semibold text-content-primary">
                {trip.vehicle_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center text-content-primary">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-content-secondary uppercase tracking-wider block">
                Fare
              </span>
              <span className="font-bold text-content-primary">
                ₹{trip.total_price.toLocaleString("en-IN")}
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
                {trip.pickup_point.stop_name || trip.pickup_point.stop_address}
              </span>
            </div>
            <div>
              <span className="text-xs text-content-secondary font-medium block">
                Drop-off Destination
              </span>
              <span className="font-semibold text-content-primary">
                {trip.drop_off_point.stop_name ||
                  trip.drop_off_point.stop_address}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border-strong flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-content-secondary">
            <Users className="w-4 h-4 text-accent" />
            <span>
              {trip.seat_count} seat{trip.seat_count > 1 ? "s" : ""} booked
              &middot; Driver: {trip.driver_name}
            </span>
          </div>
          <Link href={`/passenger/bookings/${trip.booking_id}`}>
            <Button variant="secondary">View Booking</Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
