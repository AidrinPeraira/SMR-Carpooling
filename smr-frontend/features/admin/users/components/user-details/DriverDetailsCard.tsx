"use client";

import { Button, Card, CardBody, Tag } from "@sharemyride/ui";
import { Eye, UserX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAdminDriverDetailsRequest } from "../../api/requests/getAdminDriverDetailsRequest";

interface DriverDetailsCardProps {
  userId?: string;
}

export function DriverDetailsCard({ userId }: DriverDetailsCardProps) {
  const { data: driver, isLoading } = useQuery({
    queryKey: ["adminDriverDetails", userId],
    queryFn: () => getAdminDriverDetailsRequest(userId!),
    enabled: Boolean(userId),
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <CardBody className="mb-0">
          <div className="h-6 w-48 bg-surface-muted rounded mb-6" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-10 bg-surface-muted rounded" />
            <div className="h-10 bg-surface-muted rounded" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!driver) {
    return (
      <Card className="p-6">
        <CardBody className="flex flex-col items-center text-center py-8 mb-0">
          <div className="bg-surface-muted p-4 rounded-full mb-4 text-content-tertiary">
            <UserX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-content-primary mb-2">
            Not Registered as Driver
          </h3>
          <p className="text-sm text-content-secondary max-w-sm">
            This user has not registered or completed onboarding as a driver.
          </p>
        </CardBody>
      </Card>
    );
  }

  const activeSince = driver.created_at
    ? new Date(driver.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <Card className="p-6 h-full flex flex-col justify-between">
      <CardBody className="mb-0">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-content-primary">
            Driver Profile
          </h3>
          <Tag variant="accent" className="uppercase tracking-wider">
            {driver.driver_status}
          </Tag>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              DL Number
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {driver.license_number}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Active Since
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {activeSince}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Driver Status
            </label>
            <p className="text-sm font-semibold text-content-primary uppercase">
              {driver.driver_status}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
