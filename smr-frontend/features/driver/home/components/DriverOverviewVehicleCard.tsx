"use client";

import { Card, Tag } from "@sharemyride/ui";
import { ActiveVehicleResult, VehicleStatus } from "@sharemyride/shared";
import { Car } from "lucide-react";

interface DriverOverviewVehicleCardProps {
  vehicle: ActiveVehicleResult;
}

export function DriverOverviewVehicleCard({
  vehicle,
}: DriverOverviewVehicleCardProps) {
  const isActive = vehicle.vehicle_status === VehicleStatus.ACTIVE;

  return (
    <Card className="p-5 md:p-6 shadow-xs">
      <h2 className="text-xl font-bold text-content-primary mb-4">
        Your Vehicle
      </h2>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <Car className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-content-primary">
            {vehicle.vehicle_make} {vehicle.vehicle_model}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-content-secondary">
              {vehicle.registration_number}
            </span>
            <span className="text-xs text-content-secondary capitalize">
              {vehicle.vehicle_type}
            </span>
          </div>
        </div>
        <Tag
          variant={isActive ? "accent" : "muted"}
          className={
            isActive
              ? "bg-success-surface text-success-content border-success-border text-xs font-semibold"
              : "text-xs font-semibold"
          }
        >
          {vehicle.vehicle_status.toUpperCase()}
        </Tag>
      </div>
    </Card>
  );
}
