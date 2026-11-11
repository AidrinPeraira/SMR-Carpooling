"use client";

import { useQuery } from "@tanstack/react-query";
import { Button, Card, Loader, Tag } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { useRouter } from "next/navigation";
import { getAdminBookingDetailsRequest } from "../api/requests/getAdminBookingDetailsRequest";
import { BookingStatus } from "@sharemyride/shared";

interface Props {
  bookingId: string;
}

export function AdminBookingDetailsView({ bookingId }: Props) {
  const router = useRouter();

  const { isPending, error, data } = useQuery({
    queryKey: ["adminBookingDetails", bookingId],
    queryFn: async () => {
      return await getAdminBookingDetailsRequest(bookingId);
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
    return <InlineError message={`Error fetching booking details: ${String(error)}`} />;
  }

  if (!data || !data.success || !data.payload) {
    return (
      <InlineError
        message={`Error: ${data?.message || "Failed to load booking details"}`}
      />
    );
  }

  const booking = data.payload;

  const getStatusTag = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <Tag variant="accent">{status.toUpperCase()}</Tag>;
      case BookingStatus.REJECTED:
      case BookingStatus.CANCELLED:
        return <Tag variant="muted" className="text-red-400 border-red-500/30">{status.toUpperCase()}</Tag>;
      case BookingStatus.PAYMENT_PENDING:
      case BookingStatus.REQUESTED:
        return <Tag variant="muted" className="text-amber-400 border-amber-500/30">{status.toUpperCase()}</Tag>;
      case BookingStatus.WITHDRAWN:
      default:
        return <Tag variant="muted">{status.toUpperCase()}</Tag>;
    }
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-content-primary">Booking Details</h1>
        <Button variant="ghost" onClick={() => router.back()}>
          Back to Bookings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-content-primary border-b border-border pb-2">
            Booking Overview
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-content-secondary block">Booking ID</span>
              <span className="font-mono text-content-primary">{booking.booking_id}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Status</span>
              <span>{getStatusTag(booking.booking_status)}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Distance (km)</span>
              <span className="text-content-primary font-medium">{booking.distance_km} km</span>
            </div>
            <div>
              <span className="text-content-secondary block">Seats Reserved</span>
              <span className="text-content-primary font-medium">{booking.seat_count}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Total Price</span>
              <span className="text-content-primary font-bold">₹{booking.total_price}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Trip Date</span>
              <span className="text-content-primary">
                {new Date(booking.trip_date).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-content-primary border-b border-border pb-2">
            Passenger & Vehicle Info
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-content-secondary block">Passenger ID</span>
              <span className="font-mono text-content-primary">{booking.passenger_id}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Passenger Name</span>
              <span className="text-content-primary font-medium">{booking.passenger_name}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Trip ID</span>
              <span className="font-mono text-content-primary">{booking.trip_id}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Vehicle Name</span>
              <span className="text-content-primary font-medium">{booking.vehicle_name}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-content-primary border-b border-border pb-2">
          Route & Pickup / Dropoff Points
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-content-secondary block">Pickup Point</span>
            <span className="text-content-primary font-medium">
              {booking.booking_origin?.stop_name || booking.booking_origin?.stop_address || "-"}
            </span>
          </div>
          <div>
            <span className="text-content-secondary block">Drop-off Point</span>
            <span className="text-content-primary font-medium">
              {booking.booking_destination?.stop_name || booking.booking_destination?.stop_address || "-"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
