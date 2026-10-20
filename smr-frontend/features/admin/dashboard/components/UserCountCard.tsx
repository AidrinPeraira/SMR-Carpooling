"use client";

import { Card } from "@sharemyride/ui";
import { Users, UserCheck, UserX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUsersCountRequest } from "@/features/admin/dashboard/api/requests/getUsersCountRequest";

export function UserCountCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminUsersCount"],
    queryFn: getUsersCountRequest,
  });

  if (isLoading) {
    return <div className="h-28 bg-surface-muted rounded-lg animate-pulse" />;
  }

  if (!data) return null;

  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Total Users
        </span>
        <span className="text-2xl font-bold text-content-primary">
          {data.total_users}
        </span>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-success-content font-semibold flex items-center gap-0.5">
            <UserCheck className="w-3 h-3" />
            {data.active_users} active
          </span>
          <span className="text-xs text-content-secondary font-semibold flex items-center gap-0.5">
            <UserX className="w-3 h-3" />
            {data.inactive_users} inactive
          </span>
        </div>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <Users className="w-6 h-6" />
      </div>
    </Card>
  );
}
