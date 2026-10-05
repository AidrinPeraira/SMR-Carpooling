import { Card, Button, Tag } from "@sharemyride/ui";
import { Clock, Users, IndianRupee, Navigation } from "lucide-react";

interface Props {
  startTime: string;
  availableSeats: number;
  totalSeats: number;
  estimatedFare: number;
  pickupLocation: string;
  dropoffLocation: string;
  confirmedPassengers: number;
  departureIn: string;
}

export function TodayTripCard({
  startTime,
  availableSeats,
  totalSeats,
  estimatedFare,
  pickupLocation,
  dropoffLocation,
  confirmedPassengers,
  departureIn,
}: Props) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-content-primary">
            Today&apos;s Trip
          </h2>
          <Tag variant="accent">SCHEDULED</Tag>
        </div>
        <span className="text-sm text-content-secondary font-medium">
          Departure in {departureIn}
        </span>
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
                {startTime}
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
                {availableSeats} / {totalSeats} Seats Vacant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center text-content-primary">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-content-secondary uppercase tracking-wider block">
                Estimated Fare
              </span>
              <span className="font-bold text-content-primary">
                ₹{estimatedFare.toLocaleString("en-IN")}
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
                {pickupLocation}
              </span>
            </div>
            <div>
              <span className="text-xs text-content-secondary font-medium block">
                Drop-off Destination
              </span>
              <span className="font-semibold text-content-primary">
                {dropoffLocation}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border-strong flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-content-secondary">
            <Users className="w-4 h-4 text-accent" />
            <span>{confirmedPassengers} confirmed passengers on board</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">Manage Trip / Passengers</Button>
            <Button className="flex items-center gap-1">
              <Navigation className="w-4 h-4" />
              Start Trip
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
