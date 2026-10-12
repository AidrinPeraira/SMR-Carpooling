import { Card } from "@sharemyride/ui";
import { Map, Route } from "lucide-react";
import { DriverTripStatsResult } from "@sharemyride/shared";

interface Props {
  stats: DriverTripStatsResult;
}

export function TotalTripsCard({ stats }: Props) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Total Trips Completed
        </span>
        <span className="text-2xl font-bold text-content-primary">
          {stats.total_trips}
        </span>
        <span className="text-xs text-accent font-semibold flex items-center gap-0.5 mt-1">
          <Map className="w-3 h-3" />
          {stats.trips_this_month} this month
        </span>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <Route className="w-6 h-6" />
      </div>
    </Card>
  );
}
