import { Card } from "@sharemyride/ui";
import { Route, TrendingUp } from "lucide-react";

interface Props {
  totalTrips: number;
  monthlyGrowth: number;
}

export function TotalTripsCard({ totalTrips, monthlyGrowth }: Props) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Total Trips Completed
        </span>
        <span className="text-2xl font-bold text-content-primary">
          {totalTrips}
        </span>
        <span className="text-xs text-accent font-semibold flex items-center gap-0.5 mt-1">
          <TrendingUp className="w-3 h-3" />
          +{monthlyGrowth}% this month
        </span>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <Route className="w-6 h-6" />
      </div>
    </Card>
  );
}
