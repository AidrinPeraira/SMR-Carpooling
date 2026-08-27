"use client";

import { Button, Card, CardBody, Tag } from "@sharemyride/ui";
import { AlertCircle, XCircle } from "lucide-react";

interface DriverTripActionCardProps {
  tripId: string;
  tripStatus: string;
  onCancelTrip?: () => void;
  isCancelling?: boolean;
}

export function DriverTripActionCard({
  tripId,
  tripStatus,
  onCancelTrip,
  isCancelling = false,
}: DriverTripActionCardProps) {
  const normalizedStatus = tripStatus.toLowerCase();
  const canCancel =
    normalizedStatus === "scheduled" || normalizedStatus === "fully_booked";

  if (canCancel) {
    return (
      <Card className="border border-border-subtle bg-surface-primary shadow-sm h-full flex flex-col justify-center">
        <CardBody className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <AlertCircle className="w-5 h-5 text-warning-content flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-warning-content">
                Trip Action Controls
              </h4>
              <p className="text-xs text-warning-content/80 mt-0.5">
                You can cancel this trip before it starts.
              </p>
            </div>
          </div>

          <Button
            variant="danger"
            className="w-full sm:w-auto text-xs py-2 px-4 font-medium flex items-center justify-center gap-2 shrink-0"
            disabled={isCancelling}
            onClick={
              onCancelTrip || (() => alert("Cancel trip feature coming soon!"))
            }
          >
            <XCircle className="w-4 h-4" />
            {isCancelling ? "Cancelling..." : "Cancel Trip"}
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border border-border-subtle bg-surface-card shadow-sm h-full flex flex-col justify-center">
      <CardBody className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-content-secondary flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-sm text-content-primary">
              Trip Status: {tripStatus.toUpperCase()}
            </h4>
            <p className="text-xs text-content-secondary mt-0.5">
              No further action can be taken for this trip.
            </p>
          </div>
        </div>

        <Tag variant="muted" className="text-[10px]">
          NO ACTION REQUIRED
        </Tag>
      </CardBody>
    </Card>
  );
}
