"use client";

import { useState } from "react";
import { Card } from "@sharemyride/ui";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendRange } from "@sharemyride/shared";
import { getTripTrendRequest } from "@/features/admin/dashboard/api/requests/getTripTrendRequest";

const rangeLabels: Record<TrendRange, string> = {
  [TrendRange.LAST_WEEK]: "Last Week",
  [TrendRange.LAST_MONTH]: "Last Month",
  [TrendRange.LAST_YEAR]: "Last Year",
};

export function TripTrendGraph() {
  const [range, setRange] = useState<TrendRange>(TrendRange.LAST_MONTH);

  const { data, isLoading } = useQuery({
    queryKey: ["adminTripTrend", range],
    queryFn: () => getTripTrendRequest(range),
  });

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-content-primary">
          Trip Trend
        </h3>
        <div className="flex gap-1">
          {Object.values(TrendRange).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors ${
                range === r
                  ? "bg-accent text-accent-fg"
                  : "text-content-secondary hover:bg-surface-muted"
              }`}
            >
              {rangeLabels[r]}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="h-52 bg-surface-muted rounded-lg animate-pulse" />
      ) : data?.data && data.data.length > 0 ? (
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={data.data}>
            <defs>
              <linearGradient id="tripGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="oklch(0.7468 0.1785 153)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="oklch(0.7468 0.1785 153)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.9334 0.005 256.34)"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              stroke="oklch(0.5956 0.0185 143.43)"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              stroke="oklch(0.5956 0.0185 143.43)"
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid oklch(0.9189 0.008 142.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Trips"
              stroke="oklch(0.7468 0.1785 153)"
              fill="url(#tripGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-52 flex items-center justify-center text-content-secondary text-xs">
          No trend data available
        </div>
      )}
    </Card>
  );
}
