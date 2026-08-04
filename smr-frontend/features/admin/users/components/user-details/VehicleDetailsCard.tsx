"use client";

import { Card, CardBody, Tag } from "@sharemyride/ui";
import { Car } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAdminDriverVehiclesRequest } from "@/features/admin/users/api/requests/getAdminDriverVehiclesRequest";

interface VehicleDetailsCardProps {
  userId?: string;
}

export function VehicleDetailsCard({ userId }: VehicleDetailsCardProps) {
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["adminDriverVehicles", userId],
    queryFn: () => getAdminDriverVehiclesRequest(userId!),
    enabled: Boolean(userId),
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <CardBody className="mb-0">
          <div className="h-6 w-48 bg-surface-muted rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-36 bg-surface-muted rounded" />
            <div className="h-36 bg-surface-muted rounded" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
    return (
      <Card className="p-6">
        <CardBody className="flex flex-col items-center text-center py-8 mb-0">
          <div className="bg-surface-muted p-4 rounded-full mb-4 text-content-tertiary">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-content-primary mb-2">
            No Vehicles Registered
          </h3>
          <p className="text-sm text-content-secondary max-w-sm">
            This user has not registered any vehicles on the platform yet.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardBody className="mb-0">
        <h3 className="text-lg font-bold text-content-primary mb-6">
          Registered Vehicles ({vehicles.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            const registeredDate = vehicle.created_at
              ? new Date(vehicle.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A";

            return (
              <div
                key={vehicle.vehicle_id}
                className="p-4 border border-border-subtle rounded-lg bg-surface-muted/30 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video rounded-lg overflow-hidden border border-border-strong bg-surface-muted flex items-center justify-center mb-4 relative">
                    {vehicle.vehicle_image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={vehicle.vehicle_image}
                        alt={`${vehicle.vehicle_make} ${vehicle.vehicle_model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Car className="w-8 h-8 text-content-tertiary" />
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-sm text-content-primary">
                        {vehicle.vehicle_make} {vehicle.vehicle_model}
                      </p>
                      <p className="text-xs text-content-secondary font-medium mt-0.5">
                        {vehicle.registration_number}
                      </p>
                    </div>
                    <Tag variant="accent" className="uppercase tracking-wider">
                      {vehicle.vehicle_status}
                    </Tag>
                  </div>

                  <div className="grid grid-cols-1 gap-1 text-xs text-content-secondary mb-2 border-t border-border-subtle pt-3">
                    <div>
                      <span className="text-content-tertiary font-bold uppercase tracking-wider">
                        Type:
                      </span>{" "}
                      {vehicle.vehicle_type} ({vehicle.vehicle_capacity} Seats)
                    </div>
                    <div>
                      <span className="text-content-tertiary font-bold uppercase tracking-wider">
                        Registered:
                      </span>{" "}
                      {registeredDate}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
