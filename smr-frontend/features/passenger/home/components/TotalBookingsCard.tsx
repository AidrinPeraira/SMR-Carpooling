import { Card } from "@sharemyride/ui";
import { BookOpen, CalendarCheck } from "lucide-react";
import { PassengerBookingStatsResult } from "@sharemyride/shared";

interface Props {
  stats: PassengerBookingStatsResult;
}

export function TotalBookingsCard({ stats }: Props) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Total Bookings
        </span>
        <span className="text-2xl font-bold text-content-primary">
          {stats.total_bookings}
        </span>
        <span className="text-xs text-accent font-semibold flex items-center gap-0.5 mt-1">
          <CalendarCheck className="w-3 h-3" />
          {stats.bookings_this_month} this month
        </span>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <BookOpen className="w-6 h-6" />
      </div>
    </Card>
  );
}
