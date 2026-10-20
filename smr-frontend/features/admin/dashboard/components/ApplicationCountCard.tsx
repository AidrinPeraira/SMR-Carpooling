"use client";

import { Card } from "@sharemyride/ui";
import { FileText, UserPlus, Car, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getApplicationCountRequest } from "@/features/admin/dashboard/api/requests/getApplicationCountRequest";

export function ApplicationCountCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminApplicationCount"],
    queryFn: getApplicationCountRequest,
  });

  if (isLoading) {
    return <div className="h-28 bg-surface-muted rounded-lg animate-pulse" />;
  }

  if (!data) return null;

  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Applications
        </span>
        <span className="text-2xl font-bold text-content-primary">
          {data.total_applications}
        </span>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-accent font-semibold flex items-center gap-0.5">
            <UserPlus className="w-3 h-3" />
            {data.onboarding_applications}
          </span>
          <span className="text-xs text-content-secondary font-semibold flex items-center gap-0.5">
            <Car className="w-3 h-3" />
            {data.vehicle_applications}
          </span>
          <span className="text-xs text-content-secondary font-semibold flex items-center gap-0.5">
            <RefreshCw className="w-3 h-3" />
            {data.renewal_applications}
          </span>
        </div>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <FileText className="w-6 h-6" />
      </div>
    </Card>
  );
}
