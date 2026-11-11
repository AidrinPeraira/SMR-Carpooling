import { Card } from "@sharemyride/ui";
import {
  TripStopDTO,
  JourneyStopResult,
  StopType,
} from "@sharemyride/shared";
import { MapPin, CircleDot, Flag } from "lucide-react";

interface JourneyStopsProgressProps {
  origin: TripStopDTO;
  destination: TripStopDTO;
  intermediateStops: JourneyStopResult[];
}

export function JourneyStopsProgress({
  origin,
  destination,
  intermediateStops,
}: JourneyStopsProgressProps) {
  return (
    <Card className="border border-border-subtle bg-surface-card shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-content-primary">
          Journey Stops ({intermediateStops.length + 2} Waypoints)
        </h2>
        <span className="text-xs text-content-secondary">
          {origin.stop_name} → {destination.stop_name}
        </span>
      </div>

      <div className="relative overflow-x-auto pb-2">
        <div className="flex items-center min-w-[500px] gap-2 pt-2">
          {/* Origin */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-full bg-accent text-accent-fg flex items-center justify-center">
              <CircleDot className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-content-primary mt-1 line-clamp-1">
              {origin.stop_name}
            </span>
            <span className="text-[10px] text-content-secondary">Origin</span>
          </div>

          {intermediateStops.map((stop, i) => (
            <div key={i} className="contents">
              <div className="w-8 h-0.5 bg-border-strong" />
              <div className="flex-1 flex flex-col items-center text-center">
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    stop.stop_type === StopType.PICKUP
                      ? "bg-accent/15 border-accent text-accent"
                      : "bg-error-surface border-error-border text-error-content"
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                </div>
                <span className="text-xs text-content-secondary mt-1 line-clamp-1">
                  {stop.stop_name}
                </span>
                <span className="text-[10px] text-content-secondary capitalize">
                  {stop.stop_type}
                </span>
              </div>
            </div>
          ))}

          {/* Destination */}
          <div className="w-8 h-0.5 bg-border-strong" />
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-full bg-content-primary text-surface-card flex items-center justify-center">
              <Flag className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-content-primary mt-1 line-clamp-1">
              {destination.stop_name}
            </span>
            <span className="text-[10px] text-content-secondary">
              Destination
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
