import { Card } from "@sharemyride/ui";
import { Users, Star } from "lucide-react";

interface Props {
  totalPassengers: number;
  averageRating: number;
}

export function TotalPassengersCard({
  totalPassengers,
  averageRating,
}: Props) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Total Passengers Carried
        </span>
        <span className="text-2xl font-bold text-content-primary">
          {totalPassengers}
        </span>
        <span className="text-xs text-content-secondary flex items-center gap-0.5 mt-1">
          <Star className="w-3 h-3 fill-accent text-accent" />
          {averageRating} Rating average
        </span>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <Users className="w-6 h-6" />
      </div>
    </Card>
  );
}
