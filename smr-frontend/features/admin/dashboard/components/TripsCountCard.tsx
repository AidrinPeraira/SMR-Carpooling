"use client";

import { Card } from "@sharemyride/ui";
import { Route, CheckCircle, Clock, XCircle, Ban } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTripsCountRequest } from "@/features/admin/dashboard/api/requests/getTripsCountRequest";

export function TripsCountCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminTripsCount"],
    queryFn: getTripsCountRequest,
  });

  if (isLoading) {
    return <div className="h-28 bg-surface-muted rounded-lg animate-pulse" />;
  }

  if (!data) return null;

  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Total Trips
        </span>
        <span className="text-2xl font-bold text-content-primary">
          {data.total_trips}
        </span>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-success-content font-semibold flex items-center gap-0.5">
            <CheckCircle className="w-3 h-3" />
            {data.completed_trips}
          </span>
          <span className="text-xs text-accent font-semibold flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            {data.upcoming_trips}
          </span>
          <span className="text-xs text-accent font-semibold flex items-center gap-0.5">
            <Ban className="w-3 h-3" />
            {data.cancelled_trips}
          </span>

          <span className="text-xs text-error-content font-semibold flex items-center gap-0.5">
            <XCircle className="w-3 h-3" />
            {data.cancelled_trips}
          </span>
        </div>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <Route className="w-6 h-6" />
      </div>
    </Card>
  );
}
