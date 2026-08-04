"use client";

import { Button, Card, CardBody } from "@sharemyride/ui";
import { GetUserResult } from "@sharemyride/shared";
import { Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getDriverDetailsRequest } from "../api/requests/getDriverDetailsRequest";

interface Props {
  user: GetUserResult | null;
}

export function ProfileDriverCard({ user }: Props) {
  const { data: driver, isLoading } = useQuery({
    queryKey: ["driverDetails"],
    queryFn: getDriverDetailsRequest,
    enabled: Boolean(user?.is_driver),
  });

  if (!user || !user.is_driver) {
    return (
      <Card className="p-6">
        <CardBody className="flex flex-col items-center text-center py-4 mb-0">
          <div className="bg-primary-container/10 p-3 rounded-full mb-4">
            <span className="text-primary text-2xl font-bold">🚗</span>
          </div>
          <h3 className="text-lg font-bold text-content-primary mb-2">
            Become a Driver
          </h3>
          <p className="text-sm text-content-secondary mb-6 max-w-md">
            Interested in earning? Join our community of verified drivers to
            start offering rides.
          </p>
          <Link href="/application/onboarding">
            <Button variant="primary">Get Started</Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <CardBody className="mb-0">
          <div className="h-6 w-48 bg-surface-muted rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-12 bg-surface-muted rounded" />
            <div className="h-12 bg-surface-muted rounded" />
            <div className="h-12 bg-surface-muted rounded" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!driver) {
    return (
      <Card className="p-6">
        <CardBody className="mb-0">
          <h3 className="text-lg font-bold text-content-primary mb-2">
            Driver Information
          </h3>
          <p className="text-sm text-content-secondary">
            No driver details found.
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

  const lastUpdated = driver.updated_at
    ? new Date(driver.updated_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <Card className="p-6">
      <CardBody className="mb-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <h3 className="text-lg font-bold text-content-primary">
            Driver Information
          </h3>
          <span className="bg-primary-container text-on-primary-container px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit uppercase">
            <Check className="w-3 h-3 text-primary" />
            {driver.driver_status}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              Driving License Number
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {driver.license_number}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Last Status Update
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {lastUpdated}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
