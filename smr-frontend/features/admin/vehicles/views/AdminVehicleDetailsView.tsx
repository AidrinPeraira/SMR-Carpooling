"use client";

import { useQuery } from "@tanstack/react-query";
import { Button, Card, Loader, Tag } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { useRouter } from "next/navigation";
import { getAdminVehicleRecordDetailsRequest } from "../api/requests/getAdminVehicleRecordDetailsRequest";

interface Props {
  vehicleId: string;
}

export function AdminVehicleDetailsView({ vehicleId }: Props) {
  const router = useRouter();

  const { isPending, error, data } = useQuery({
    queryKey: ["adminVehicleRecordDetails", vehicleId],
    queryFn: () => getAdminVehicleRecordDetailsRequest(vehicleId),
  });

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <InlineError
        message={`Error fetching vehicle details: ${String(error)}`}
      />
    );
  }

  if (!data) {
    return <InlineError message="Vehicle record not found." />;
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-content-primary">
          Vehicle Details
        </h1>
        <Button variant="ghost" onClick={() => router.back()}>
          Back to Vehicles
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-content-primary border-b border-border pb-2">
            Vehicle Information
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-content-secondary block">Record ID</span>
              <span className="font-mono text-content-primary">
                {data.record_id}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">Vehicle Type</span>
              <Tag>
                {data.vehicle_type.replace(/_/g, " ").toUpperCase()}
              </Tag>
            </div>
            <div>
              <span className="text-content-secondary block">Make</span>
              <span className="text-content-primary font-medium">
                {data.vehicle_make}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">Model</span>
              <span className="text-content-primary font-medium">
                {data.vehicle_model}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">Capacity</span>
              <span className="text-content-primary font-medium">
                {data.vehicle_capacity}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">
                Registration Number
              </span>
              <span className="text-content-primary font-medium">
                {data.registration_number}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">
                Registration Expiry
              </span>
              <span className="text-content-primary font-medium">
                {new Date(data.registration_expiry).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">
                Insurance Number
              </span>
              <span className="text-content-primary font-medium">
                {data.insurance_number}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">
                Insurance Expiry
              </span>
              <span className="text-content-primary font-medium">
                {new Date(data.insurance_expiry).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">Registered</span>
              <span className="text-content-primary font-medium">
                {new Date(data.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-content-primary border-b border-border pb-2">
            Owner Information
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-content-secondary block">User ID</span>
              <span className="font-mono text-content-primary">
                {data.owner.user_id}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">Name</span>
              <span className="text-content-primary font-medium">
                {data.owner.first_name} {data.owner.last_name}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-content-secondary block">Email</span>
              <span className="text-content-primary font-medium">
                {data.owner.email_id}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-content-primary border-b border-border pb-2">
            Application
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-content-secondary block">
                Application ID
              </span>
              <span className="font-mono text-content-primary">
                {data.application.application_id}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">Type</span>
              <Tag>
                {data.application.application_type
                  .replace(/_/g, " ")
                  .toUpperCase()}
              </Tag>
            </div>
            <div>
              <span className="text-content-secondary block">Status</span>
              <Tag
                variant={
                  data.application.application_status === "approved"
                    ? "accent"
                    : "muted"
                }
              >
                {data.application.application_status.toUpperCase()}
              </Tag>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
