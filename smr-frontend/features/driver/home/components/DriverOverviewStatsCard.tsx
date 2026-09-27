"use client";

import { Card } from "@sharemyride/ui";
import { DriverStatsResult } from "@sharemyride/shared";
import { TrendingUp, Users, MapPin } from "lucide-react";

interface DriverOverviewStatsCardProps {
  stats: DriverStatsResult;
}

export function DriverOverviewStatsCard({
  stats,
}: DriverOverviewStatsCardProps) {
  const items = [
    {
      label: "Trips Completed",
      value: stats.total_trips_completed,
      icon: MapPin,
    },
    {
      label: "Total Earnings",
      value: `₹${stats.total_earnings}`,
      icon: TrendingUp,
    },
    {
      label: "Passengers Served",
      value: stats.total_passengers,
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card
          key={item.label}
          className="p-5 flex items-center gap-4 shadow-xs"
        >
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <item.icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
              {item.label}
            </p>
            <p className="text-xl font-bold text-content-primary">
              {item.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
