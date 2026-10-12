"use client";

import { InlineError } from "@/components/InlineError";
import { getAdminJourneyDetailsRequest } from "@/features/admin/payouts/api/requests/getAdminJourneyDetailsRequest";
import { Card, CardBody, CardHeader, Loader, Table, TableProps, Tag } from "@sharemyride/ui";
import { useQuery } from "@tanstack/react-query";
import { AdminJourneyPassengerResult, PassengerJourneyStatus } from "@sharemyride/shared";

interface JourneyInfoCardProps {
  journeyId: string;
}

export function JourneyInfoCard({ journeyId }: JourneyInfoCardProps) {
  const { isPending, data, error } = useQuery({
    queryKey: ["adminJourneyDetails", journeyId],
    queryFn: async () => getAdminJourneyDetailsRequest(journeyId),
    staleTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
    gcTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
    enabled: !!journeyId,
  });

  if (isPending) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <InlineError
        message={`Failed to load journey details: ${error}`}
      ></InlineError>
    );
  }

  if (!data?.success || !data?.payload) {
    return (
      <InlineError
        message={`Failed to load journey details: ${data?.message || "Invalid payload"}`}
      ></InlineError>
    );
  }

  const journey = data.payload;

  const getStatusTag = (status: string) => {
    switch (status) {
      case "picked_up":
        return (
          <Tag variant="accent" className="uppercase tracking-wider">
            Picked Up
          </Tag>
        );
      case "dropped_off":
        return (
          <Tag variant="accent" className="uppercase tracking-wider">
            Dropped Off
          </Tag>
        );
      case "no_show":
        return (
          <Tag
            variant="muted"
            className="bg-error-surface text-error-content border border-error-border uppercase tracking-wider"
          >
            No Show
          </Tag>
        );
      default:
        return (
          <Tag
            variant="muted"
            className="bg-warning-surface text-warning-content border border-warning-border uppercase tracking-wider"
          >
            {status.replace(/_/g, " ")}
          </Tag>
        );
    }
  };

  const passengerTableData: TableProps<AdminJourneyPassengerResult> = {
    data: journey.passengers,
    columnNames: [
      {
        headerName: "Passenger",
        fieldName: "passenger_name",
      },
      {
        headerName: "Booking ID",
        fieldName: "booking_id",
        customRender: (value) => {
          const id = String(value);
          return (
            <span title={id}>
              {id.length > 12 ? `${id.slice(0, 12)}...` : id}
            </span>
          );
        },
      },
      {
        headerName: "Status",
        fieldName: "passenger_status",
        customRender: (value) =>
          getStatusTag(value as PassengerJourneyStatus),
      },
      {
        headerName: "Pickup",
        fieldName: "pickup_location",
        customRender: (_value, row) =>
          row.pickup_location.stop_name || row.pickup_location.stop_address,
      },
      {
        headerName: "Drop-off",
        fieldName: "drop_off_location",
        customRender: (_value, row) =>
          row.drop_off_location.stop_name || row.drop_off_location.stop_address,
      },
      {
        headerName: "Pickup Verified",
        fieldName: "pickup_verified",
        customRender: (value) =>
          value ? (
            <Tag variant="accent" className="uppercase tracking-wider">
              Yes
            </Tag>
          ) : (
            <Tag variant="muted" className="uppercase tracking-wider">
              No
            </Tag>
          ),
        align: "center",
      },
    ],
  };

  const formattedDate = new Date(journey.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const getJourneyStatusTag = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <Tag
            variant="muted"
            className="bg-warning-surface text-warning-content border border-warning-border uppercase tracking-wider"
          >
            In Progress
          </Tag>
        );
      case "completed":
        return (
          <Tag variant="accent" className="uppercase tracking-wider">
            Completed
          </Tag>
        );
      default:
        return (
          <Tag variant="muted" className="uppercase tracking-wider">
            {status.replace(/_/g, " ")}
          </Tag>
        );
    }
  };

  return (
    <Card className="p-6">
      <CardHeader className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-2">
          <h2 className="text-xl font-bold text-content-primary">
            Journey Details
          </h2>
          {getJourneyStatusTag(journey.journey_status)}
        </div>
        <p className="text-sm text-content-secondary">
          Journey ID: {journey.journey_id}
        </p>
      </CardHeader>

      <CardBody className="space-y-6 border-t border-border-subtle pt-6 mb-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Origin
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {journey.origin.stop_name || journey.origin.stop_address}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Destination
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {journey.destination.stop_name ||
                journey.destination.stop_address}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Started At
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {formattedDate}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Driver ID
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {journey.driver_id}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Stops
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {journey.intermediate_stops.length} intermediate stop(s)
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Passengers
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {journey.passengers.length} passenger(s)
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-content-primary mb-3">
            Passengers
          </h3>
          <Table
            columnNames={passengerTableData.columnNames}
            data={passengerTableData.data}
          />
        </div>
      </CardBody>
    </Card>
  );
}
