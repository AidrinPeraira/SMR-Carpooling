"use client";

import { InlineError } from "@/components/InlineError";
import { getAdminTripDetailsRequest } from "@/features/admin/trips/api/requests/getAdminTripDetailsRequest";
import { Card, CardBody, CardHeader, Loader } from "@sharemyride/ui";
import { useQuery } from "@tanstack/react-query";

interface TripInfoCardProps {
  tripId: string;
}

export function TripInfoCard({ tripId }: TripInfoCardProps) {
  const { isPending, data, error } = useQuery({
    queryKey: ["adminTripDetails", tripId],
    queryFn: async () => getAdminTripDetailsRequest(tripId),
    staleTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
    gcTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
    enabled: !!tripId,
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
        message={`Failed to load trip details: ${error}`}
      ></InlineError>
    );
  }

  if (!data?.success || !data?.payload) {
    return (
      <InlineError
        message={`Failed to load trip details: ${data?.message || "Invalid payload"}`}
      ></InlineError>
    );
  }

  const trip = data.payload;

  const formattedDate = new Date(trip.trip_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="p-6">
      <CardHeader className="mb-6">
        <h2 className="text-xl font-bold text-content-primary">
          Trip & Journey Details
        </h2>
        <p className="text-sm text-content-secondary mt-1">
          Trip ID: {trip.trip_id}
        </p>
      </CardHeader>

      <CardBody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 border-t border-border-subtle pt-6 mb-0">
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
            Origin
          </label>
          <p className="text-sm font-semibold text-content-primary">
            {trip.trip_origin.stop_name || trip.trip_origin.stop_address}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
            Destination
          </label>
          <p className="text-sm font-semibold text-content-primary">
            {trip.trip_destination.stop_name ||
              trip.trip_destination.stop_address}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
            Trip Date
          </label>
          <p className="text-sm font-semibold text-content-primary">
            {formattedDate}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
            Driver Name
          </label>
          <p className="text-sm font-semibold text-content-primary">
            {trip.driver_name}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
            Vehicle
          </label>
          <p className="text-sm font-semibold text-content-primary">
            {trip.vehicle_name}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
            Bookings
          </label>
          <p className="text-sm font-semibold text-content-primary">
            {trip.bookings.length} booking(s)
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
