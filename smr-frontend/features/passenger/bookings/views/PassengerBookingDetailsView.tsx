"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPassengerBookingDetailsRequest } from "../api/getPassengerBookingDetailsRequest";
import { withdrawBookingRequest } from "../api/withdrawBookingRequest";
import { BookingDetailsActionCard } from "../components/BookingDetailsActionCard";
import { MapContainer } from "@/features/map/components/MapContainer";
import { useMap } from "@/features/map/hooks/useMap";
import { MapPoint } from "@/features/map/types/MapTypes";
import { Button, Card, CardBody, Loader, Tag, useToast } from "@sharemyride/ui";
import { ArrowLeft, Calendar, Car, Navigation } from "lucide-react";

interface PassengerBookingDetailsViewProps {
  bookingId: string;
}

export function PassengerBookingDetailsView({
  bookingId,
}: PassengerBookingDetailsViewProps) {
  const map = useMap();
  const toast = useToast();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const {
    data: booking,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["passengerBookingDetails", bookingId],
    queryFn: () => getPassengerBookingDetailsRequest(bookingId),
  });

  useEffect(() => {
    if (!booking) return;
    const currentBooking = booking;

    async function setupMapRoutes() {
      try {
        await map.clearAllMarkers();
        await map.clearAllRoutes();

        const pickupPoint: MapPoint = [
          currentBooking.pickup_point.stop_lng,
          currentBooking.pickup_point.stop_lat,
        ];
        const dropOffPoint: MapPoint = [
          currentBooking.drop_off_point.stop_lng,
          currentBooking.drop_off_point.stop_lat,
        ];

        // 1. Fetch & Draw Passenger Pickup -> Drop-off Route (Theme Accent Emerald Green)
        try {
          const passengerRouteData = await map.getRoute([pickupPoint, dropOffPoint]);
          if (passengerRouteData?.route) {
            await map.drawRoute(passengerRouteData.route, {
              id: "passenger-booking-route",
              color: "#10b981",
              width: 6,
              opacity: 0.95,
            });
          }
        } catch {
          // Fallback straight segment line if route API fails
          await map.drawRoute([pickupPoint, dropOffPoint], {
            id: "passenger-booking-route",
            color: "#10b981",
            width: 6,
          });
        }

        // 2. Add Pickup & Drop-off Markers
        await map.addMarker(pickupPoint);
        await map.addMarker(dropOffPoint);

        // 3. Fit map bounds to encompass pickup and drop-off points
        await map.fitBounds([pickupPoint, dropOffPoint]);
      } catch (err) {
        console.error("Failed to render passenger booking map route:", err);
      }
    }

    setupMapRoutes();
  }, [booking, map]);

  const formattedDate = booking?.trip_date
    ? new Date(booking.trip_date).toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "N/A";

  const renderStatusTag = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "confirmed":
        return (
          <Tag
            variant="accent"
            className="bg-success-surface text-success-content border-success-border"
          >
            CONFIRMED
          </Tag>
        );
      case "requested":
        return (
          <Tag
            variant="muted"
            className="bg-warning-surface text-warning-content border-warning-border"
          >
            REQUESTED
          </Tag>
        );
      case "payment_pending":
        return (
          <Tag
            variant="muted"
            className="bg-accent/15 text-accent border-accent/30"
          >
            PAYMENT PENDING
          </Tag>
        );
      case "rejected":
      case "cancelled":
        return (
          <Tag
            variant="muted"
            className="bg-error-surface text-error-content border-error-border"
          >
            {s.toUpperCase()}
          </Tag>
        );
      default:
        return <Tag variant="muted">{status.toUpperCase()}</Tag>;
    }
  };

  const handleWithdraw = async () => {
    if (!booking) return;
    try {
      setIsWithdrawing(true);
      await withdrawBookingRequest(booking.booking_id);
      toast("Booking Withdrawn", {
        variant: "warn",
        description: "Your booking request has been successfully withdrawn.",
      });
      refetch();
    } catch (err: unknown) {
      toast("Withdraw Failed", {
        variant: "error",
        description:
          (err as Error).message || "Could not withdraw booking request.",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Back Navigation */}
      <Link
        href="/passenger/bookings"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-content-secondary hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Bookings
      </Link>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader />
          <p className="text-sm text-content-secondary animate-pulse">
            Fetching booking details...
          </p>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-error-border bg-error-surface p-6 text-center text-error-content space-y-3">
          <h3 className="font-semibold text-lg">Error Loading Details</h3>
          <p className="text-sm">
            {(error as Error)?.message || "Could not load booking details."}
          </p>
          <Button
            variant="secondary"
            className="text-xs py-1.5 px-3"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      )}

      {booking && (
        <>
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-content-secondary">
                Booking Details
              </p>
              <h1 className="text-2xl font-bold text-content-primary mt-1">
                Driver: {booking.driver_name}
              </h1>
            </div>
            <div>{renderStatusTag(booking.status)}</div>
          </div>

          {/* Embedded Map Card */}
          <Card className="border border-border-subtle bg-surface-card overflow-hidden shadow-sm">
            <div className="p-3 border-b border-border-subtle flex items-center justify-between bg-surface-muted/50 text-xs">
              <span className="font-semibold text-content-primary flex items-center gap-2">
                <Navigation className="w-4 h-4 text-accent" />
                Pickup & Drop-off Route Map
              </span>
              <span className="text-content-secondary text-[11px]">
                {booking.booking_distance} km total
              </span>
            </div>
            <div className="h-64 sm:h-80 w-full relative">
              <MapContainer />
            </div>
          </Card>

          {/* Trip Overview Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-surface-card rounded-xl border border-border-subtle flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center text-accent flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-content-secondary block text-xs">
                  Departure Date & Time
                </span>
                <span className="font-semibold text-sm text-content-primary">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="p-4 bg-surface-card rounded-xl border border-border-subtle flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center text-accent flex-shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-content-secondary block text-xs">
                  Vehicle Details
                </span>
                <span className="font-semibold text-sm text-content-primary">
                  {booking.trip_vehicle}
                </span>
              </div>
            </div>
          </div>

          {/* Stop Points Details Card */}
          <Card className="border border-border-subtle bg-surface-card shadow-sm">
            <CardBody className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 text-accent font-bold text-xs mt-0.5 ring-4 ring-accent/10">
                  A
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
                    Pickup Location
                  </p>
                  <p className="font-bold text-base text-content-primary">
                    {booking.pickup_point.stop_name}
                  </p>
                  <p className="text-xs text-content-secondary">
                    {booking.pickup_point.stop_address}
                  </p>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-error-content/15 flex items-center justify-center flex-shrink-0 text-error-content font-bold text-xs mt-0.5 ring-4 ring-error-content/10">
                  B
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
                    Drop-off Location
                  </p>
                  <p className="font-bold text-base text-content-primary">
                    {booking.drop_off_point.stop_name}
                  </p>
                  <p className="text-xs text-content-secondary">
                    {booking.drop_off_point.stop_address}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Metrics Summary Grid */}
          <div className="grid grid-cols-3 gap-3 text-center bg-surface-card rounded-xl p-4 text-xs border border-border-subtle shadow-sm">
            <div>
              <span className="text-content-secondary block text-xs">
                Distance
              </span>
              <span className="font-semibold text-content-primary text-base">
                {booking.booking_distance} km
              </span>
            </div>
            <div>
              <span className="text-content-secondary block text-xs">
                Booked Seats
              </span>
              <span className="font-semibold text-content-primary text-base">
                {booking.seat_count}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block text-xs">
                Total Price
              </span>
              <span className="font-bold text-accent text-base">
                ₹{booking.total_price}
              </span>
            </div>
          </div>

          {/* Action Card Section */}
          <div className="pt-2">
            <BookingDetailsActionCard
              bookingId={booking.booking_id}
              amount={booking.total_price}
              status={booking.status}
              onWithdraw={handleWithdraw}
              isWithdrawing={isWithdrawing}
            />
          </div>
        </>
      )}
    </div>
  );
}
