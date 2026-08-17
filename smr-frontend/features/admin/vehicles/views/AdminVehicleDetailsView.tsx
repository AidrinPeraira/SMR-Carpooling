"use client";

import { useQuery } from "@tanstack/react-query";
import { Button, Card, Loader, Tag } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { useRouter } from "next/navigation";
import { getAdminVehiclesRequest } from "../api/requests/getAdminVehiclesRequest";

interface Props {
  vehicleId: string;
}

export function AdminVehicleDetailsView({ vehicleId }: Props) {
  const router = useRouter();

  const { isPending, error, data } = useQuery({
    queryKey: ["adminVehicleDetails"],
    queryFn: async () => {
      return await getAdminVehiclesRequest();
    },
  });

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <InlineError message={`Error fetching vehicle details: ${String(error)}`} />;
  }

  if (!data || !data.success || !data.payload) {
    return (
      <InlineError
        message={`Error: ${data?.message || "Failed to load vehicle details"}`}
      />
    );
  }

  const vehicle = data.payload.vehicles.find((v) => v.id === vehicleId);
  const matchingPricing = data.payload.pricing_rules.find(
    (p) => p.vehicle_type === vehicle?.vehicle_type,
  );

  if (!vehicle) {
    return <InlineError message="Vehicle specification not found." />;
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-content-primary">Vehicle Details</h1>
        <Button variant="ghost" onClick={() => router.back()}>
          Back to Vehicles
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-content-primary border-b border-border pb-2">
            Vehicle Specification
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-content-secondary block">Specification ID</span>
              <span className="font-mono text-content-primary">{vehicle.id}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Status</span>
              <span>
                {vehicle.is_active ? (
                  <Tag variant="accent">ACTIVE</Tag>
                ) : (
                  <Tag variant="muted">INACTIVE</Tag>
                )}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">Make</span>
              <span className="text-content-primary font-medium">{vehicle.vehicle_make}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Model</span>
              <span className="text-content-primary font-medium">{vehicle.vehicle_model}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Vehicle Category</span>
              <span className="text-content-primary font-medium">
                {vehicle.vehicle_type.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-content-primary border-b border-border pb-2">
            Associated Pricing Rule
          </h2>
          {matchingPricing ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-content-secondary block">Base Price</span>
                <span className="text-content-primary font-bold">₹{matchingPricing.base_price}</span>
              </div>
              <div>
                <span className="text-content-secondary block">Price / KM</span>
                <span className="text-content-primary font-bold">₹{matchingPricing.price_per_km}</span>
              </div>
              <div>
                <span className="text-content-secondary block">Pricing Rule ID</span>
                <span className="font-mono text-content-primary">{matchingPricing.id}</span>
              </div>
              <div>
                <span className="text-content-secondary block">Pricing Status</span>
                <span>
                  {matchingPricing.is_active ? (
                    <Tag variant="accent">ACTIVE</Tag>
                  ) : (
                    <Tag variant="muted">INACTIVE</Tag>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-content-secondary italic">
              No specific pricing rule configured for this vehicle category.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
