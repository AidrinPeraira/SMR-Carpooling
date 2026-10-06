import { Card } from "@sharemyride/ui";
import { Users } from "lucide-react";
import { DriverTripStatsResult } from "@sharemyride/shared";

interface Props {
  stats: DriverTripStatsResult;
}

export function TotalPassengersCard({ stats }: Props) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Total Passengers Carried
        </span>
        <span className="text-2xl font-bold text-content-primary">
          {stats.total_passengers}
        </span>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <Users className="w-6 h-6" />
      </div>
    </Card>
  );
}
