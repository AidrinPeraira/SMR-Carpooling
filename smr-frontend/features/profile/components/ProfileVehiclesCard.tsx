"use client";

import { Button, Card, CardBody } from "@sharemyride/ui";
import { GetUserResult } from "@sharemyride/shared";
import { useQuery } from "@tanstack/react-query";
import { getDriverVehiclesRequest } from "@/features/profile/api/requests/getDriverVehiclesRequest";
import Link from "next/link";
import { Car, CheckCircle } from "lucide-react";

interface Props {
  user: GetUserResult | null;
}

export function ProfileVehiclesCard({ user }: Props) {
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["driverVehicles"],
    queryFn: getDriverVehiclesRequest,
    enabled: Boolean(user?.is_driver),
  });

  if (!user || !user.is_driver) {
    return (
      <Card className="p-6">
        <CardBody className="flex flex-col items-center text-center py-4 mb-0">
          <h3 className="text-lg font-bold text-content-primary mb-2">
            Vehicle Details
          </h3>
          <p className="text-sm text-content-secondary">
            Register as a driver to add and manage your vehicles.
          </p>
        </CardBody>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <CardBody className="mb-0">
          <div className="h-6 w-48 bg-surface-muted rounded mb-6" />
          <div className="h-32 bg-surface-muted rounded" />
        </CardBody>
      </Card>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <Card className="p-6">
        <CardBody className="mb-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-content-primary">
              Vehicle Details
            </h3>
            <Link href="/application/add-vehicle">
              <Button variant="ghost">Add Vehicle</Button>
            </Link>
          </div>
          <p className="text-sm text-content-secondary text-center py-6">
            No registered vehicles found. Add your first vehicle to start
            offering rides.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardBody className="mb-0">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-content-primary">
            Registered Vehicles ({vehicles.length})
          </h3>
          <Link href="/application/add-vehicle">
            <Button variant="ghost">Add Vehicle</Button>
          </Link>
        </div>

        <div className="space-y-6">
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
                className="p-4 rounded-xl border border-border-default bg-surface-muted/30 flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden border border-border-strong bg-surface-muted flex items-center justify-center relative">
                  {vehicle.vehicle_image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={vehicle.vehicle_image}
                      alt={`${vehicle.vehicle_make} ${vehicle.vehicle_model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Car className="w-10 h-10 text-content-tertiary" />
                  )}
                </div>

                <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
                      Vehicle Make & Model
                    </label>
                    <p className="text-sm font-semibold text-content-primary">
                      {vehicle.vehicle_make} {vehicle.vehicle_model}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
                      Type & Capacity
                    </label>
                    <p className="text-sm font-semibold text-content-primary">
                      {vehicle.vehicle_type} • {vehicle.vehicle_capacity} Seats
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
                      Registration Number
                    </label>
                    <p className="text-sm font-semibold text-content-primary">
                      {vehicle.registration_number}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
                      Status
                    </label>
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container uppercase">
                      <CheckCircle className="w-3 h-3 text-primary" />
                      {vehicle.vehicle_status}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
                      Registered Date
                    </label>
                    <p className="text-xs text-content-secondary">
                      {registeredDate}
                    </p>
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
