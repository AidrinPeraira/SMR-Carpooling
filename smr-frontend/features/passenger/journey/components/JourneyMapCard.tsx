import { Card } from "@sharemyride/ui";
import { MapContainer } from "@/features/map/components/MapContainer";
import { Navigation } from "lucide-react";
import {
  TripStopDTO,
  JourneyStopResult,
} from "@sharemyride/shared";

interface JourneyMapCardProps {
  origin: TripStopDTO;
  destination: TripStopDTO;
  intermediateStops: JourneyStopResult[];
}

export function JourneyMapCard({
  origin,
  destination,
}: JourneyMapCardProps) {
  return (
    <Card className="border border-border-subtle bg-surface-card overflow-hidden shadow-sm p-0">
      <div className="p-3 border-b border-border-subtle flex items-center justify-between bg-surface-muted/50 text-xs">
        <span className="font-semibold text-content-primary flex items-center gap-2">
          <Navigation className="w-4 h-4 text-accent" />
          Live Journey Map
        </span>
        <span className="text-content-secondary text-[11px]">
          {origin.stop_name} → {destination.stop_name}
        </span>
      </div>
      <div className="h-64 sm:h-80 w-full relative">
        <MapContainer enableLocationTracking />
      </div>
    </Card>
  );
}
