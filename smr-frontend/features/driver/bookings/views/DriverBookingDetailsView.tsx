"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import * as turf from "@turf/turf";
import { getDriverBookingDetailsRequest } from "../api/getDriverBookingDetailsRequest";
import { acceptBookingRequest } from "../api/acceptBookingRequest";
import { rejectBookingRequest } from "../api/rejectBookingRequest";
import { MapContainer } from "@/features/map/components/MapContainer";
import { useMap } from "@/features/map/hooks/useMap";
import { MapPoint } from "@/features/map/types/MapTypes";
import { Button, Card, CardBody, Loader, Tag, useToast } from "@sharemyride/ui";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Navigation,
  Calendar,
  Car,
} from "lucide-react";

interface DriverBookingDetailsViewProps {
  bookingId: string;
}

export function DriverBookingDetailsView({
  bookingId,
}: DriverBookingDetailsViewProps) {
  const router = useRouter();
  const map = useMap();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const {
    data: booking,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["driverBookingDetails", bookingId],
    queryFn: () => getDriverBookingDetailsRequest(bookingId),
  });

  // Calculate route metrics and deviation using Turf
  const [turfMetrics, setTurfMetrics] = useState<{
    originalTripKm: number;
    modifiedTripKm: number;
    extraDeviationKm: number;
    bookingSegmentKm: number;
  } | null>(null);

  useEffect(() => {
    if (!booking) return;
    const currentBooking = booking;

    async function setupMapRoutes() {
      try {
        await map.clearAllMarkers();
        await map.clearAllRoutes();

        // trip_route from @sharemyride/shared is MapPoint[] ([number, number][])
        const tripRoutePoints: MapPoint[] = currentBooking.trip_route || [];
        const originPoint: MapPoint = tripRoutePoints[0];
        const destinationPoint: MapPoint =
          tripRoutePoints[tripRoutePoints.length - 1];

        const pickupPoint: MapPoint = [
          currentBooking.pickup_point.stop_lng,
          currentBooking.pickup_point.stop_lat,
        ];
        const dropOffPoint: MapPoint = [
          currentBooking.drop_off_point.stop_lng,
          currentBooking.drop_off_point.stop_lat,
        ];

        // 1. Draw Original Scheduled Trip Route (Theme Slate / Sky Blue)
        if (tripRoutePoints.length > 0) {
          await map.drawRoute(tripRoutePoints, {
            id: "original-trip-route",
            color: "#38bdf8",
            width: 5,
            opacity: 0.45,
          });
        }

        // 2. Fetch & Draw Detour Route Passing Through Pickup & Drop-off (Theme Accent Emerald Green)
        let modifiedPoints: MapPoint[] = [];
        let modifiedKm = 0;

        try {
          const waypoints: MapPoint[] = [
            originPoint,
            pickupPoint,
            dropOffPoint,
            destinationPoint,
          ].filter(Boolean);

          const detourRouteData = await map.getRoute(waypoints);
          if (detourRouteData?.route) {
            modifiedPoints = detourRouteData.route;
            modifiedKm = detourRouteData.totalLengthKm;
            await map.drawRoute(modifiedPoints, {
              id: "modified-trip-route",
              color: "#10b981",
              width: 6,
              opacity: 0.95,
            });
          }
        } catch {
          // Fallback: draw straight segment line if route API fails
          await map.drawRoute([pickupPoint, dropOffPoint], {
            id: "modified-trip-route",
            color: "#10b981",
            width: 6,
          });
        }

        // 3. Add Pickup & Drop-off Markers
        await map.addMarker(pickupPoint);
        await map.addMarker(dropOffPoint);

        // 4. Fit map bounds to encompass all route waypoints
        const allPoints: MapPoint[] = [
          ...tripRoutePoints,
          ...modifiedPoints,
          pickupPoint,
          dropOffPoint,
        ].filter(Boolean);

        if (allPoints.length > 0) {
          await map.fitBounds(allPoints);
        }

        // 5. Perform Turf Distance & Extra Kilometer Math
        if (tripRoutePoints.length >= 2) {
          const line = turf.lineString(tripRoutePoints);
          const origKm = turf.length(line, { units: "kilometers" });

          const segmentLine = turf.lineString([pickupPoint, dropOffPoint]);
          const segmentKm = turf.length(segmentLine, { units: "kilometers" });

          const calcModifiedKm = modifiedKm || origKm + segmentKm;
          const extraKm = Math.max(
            0,
            Number((calcModifiedKm - origKm).toFixed(1)),
          );

          setTurfMetrics({
            originalTripKm: Number(origKm.toFixed(1)),
            modifiedTripKm: Number(calcModifiedKm.toFixed(1)),
            extraDeviationKm: extraKm,
            bookingSegmentKm: Number(segmentKm.toFixed(1)),
          });
        }
      } catch (err) {
        console.error("Failed to render booking map routes:", err);
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

  const handleAccept = async () => {
    if (!booking) return;
    try {
      setIsAccepting(true);
      await acceptBookingRequest(booking.booking_id);
      toast("Booking Accepted", {
        variant: "success",
        description: `Accepted booking request for ${booking.passenger_name}.`,
      });
      refetch();
    } catch (err: any) {
      toast("Accept Failed", {
        variant: "error",
        description: err.message || "Could not accept booking request.",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!booking) return;
    try {
      setIsRejecting(true);
      await rejectBookingRequest(booking.booking_id);
      toast("Booking Rejected", {
        variant: "warn",
        description: `Rejected booking request for ${booking.passenger_name}.`,
      });
      refetch();
    } catch (err: any) {
      toast("Reject Failed", {
        variant: "error",
        description: err.message || "Could not reject booking request.",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden">
      {/* Map Area (Full container background on mobile, right side on desktop) */}
      <div className="absolute inset-0 lg:relative lg:inset-auto flex-1 h-full w-full">
        <MapContainer />
      </div>

      {/* Left Details Sidebar (Collapsible Drawer on mobile/tablet, Sidebar on desktop) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-20 bg-surface-card border-t border-border-subtle rounded-t-2xl shadow-2xl transition-all duration-300 ${
          isOpen ? "max-h-[85vh]" : "max-h-12 overflow-hidden"
        } lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:max-h-full lg:h-full lg:w-full lg:max-w-md lg:flex-shrink-0 lg:rounded-none lg:border-t-0 lg:border-r lg:shadow-none lg:z-auto lg:bg-surface-base flex flex-col`}
      >
        {/* Mobile Collapsible Header */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2.5 px-4 flex items-center justify-between text-xs font-semibold text-content-secondary border-b border-border-subtle bg-surface-muted/50 rounded-t-2xl lg:hidden cursor-pointer hover:bg-surface-muted transition-colors flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <span className="w-8 h-1 bg-border-strong rounded-full inline-block" />
            <span>{isOpen ? "Collapse Details" : "Show Booking Details"}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>

        {/* Details Scrollable Container */}
        <div className="overflow-y-auto p-4 lg:p-6 flex-1 space-y-5">
          {/* Back Navigation */}
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-content-secondary hover:text-accent transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader />
              <p className="text-sm text-content-secondary animate-pulse">
                Fetching booking details...
              </p>
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-error-border bg-error-surface p-5 text-center text-error-content space-y-3">
              <h3 className="font-semibold text-base">Error Loading Details</h3>
              <p className="text-xs">
                {(error as Error)?.message || "Could not load booking details."}
              </p>
              <Button
                variant="secondary"
                className="text-xs py-1 px-3"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          )}

          {booking && (
            <>
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-border-subtle">
                <div>
                  <h1 className="text-xl font-bold text-content-primary">
                    {booking.passenger_name}
                  </h1>
                </div>
                {renderStatusTag(booking.status)}
              </div>

              {/* Trip Overview Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-surface-muted rounded-xl border border-border-subtle flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
                  <div>
                    <span className="text-content-secondary block text-[10px]">
                      Departure Date
                    </span>
                    <span className="font-medium text-content-primary">
                      {formattedDate}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-surface-muted rounded-xl border border-border-subtle flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-accent flex-shrink-0" />
                  <div>
                    <span className="text-content-secondary block text-[10px]">
                      Vehicle
                    </span>
                    <span className="font-medium text-content-primary">
                      {booking.trip_vehicle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stop Points Details */}
              <Card className="border border-border-subtle bg-surface-card">
                <CardBody className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 text-accent font-bold text-xs mt-0.5">
                      A
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
                        Pickup Location
                      </p>
                      <p className="font-bold text-sm text-content-primary">
                        {booking.pickup_point.stop_name}
                      </p>
                      <p className="text-xs text-content-secondary">
                        {booking.pickup_point.stop_address}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border-subtle pt-4 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-error-content/15 flex items-center justify-center flex-shrink-0 text-error-content font-bold text-xs mt-0.5">
                      B
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
                        Drop-off Location
                      </p>
                      <p className="font-bold text-sm text-content-primary">
                        {booking.drop_off_point.stop_name}
                      </p>
                      <p className="text-xs text-content-secondary">
                        {booking.drop_off_point.stop_address}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Metrics Summary */}
              <div className="grid grid-cols-3 gap-2 text-center bg-surface-muted rounded-xl p-3 text-xs border border-border-subtle">
                <div>
                  <span className="text-content-secondary block text-[10px]">
                    Distance
                  </span>
                  <span className="font-semibold text-content-primary text-sm">
                    {booking.booking_distance} km
                  </span>
                </div>
                <div>
                  <span className="text-content-secondary block text-[10px]">
                    Seats
                  </span>
                  <span className="font-semibold text-content-primary text-sm">
                    {booking.seat_count}
                  </span>
                </div>
                <div>
                  <span className="text-content-secondary block text-[10px]">
                    Total Price
                  </span>
                  <span className="font-bold text-accent text-sm">
                    ₹{booking.total_price}
                  </span>
                </div>
              </div>

              {/* Simplified Route Detour / Extra Distance Component */}
              {turfMetrics && (
                <div className="p-3 bg-accent/5 rounded-xl border border-accent/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-content-primary">
                    <Navigation className="w-4 h-4 text-accent" />
                    <span>Route Detour / Extra Distance</span>
                  </div>
                  <span className="font-bold text-accent text-sm">
                    +{turfMetrics.extraDeviationKm} km
                  </span>
                </div>
              )}

              {/* Action Buttons Section */}
              <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
                <Button
                  variant="danger"
                  className="flex-1 text-xs py-2 font-medium"
                  disabled={
                    booking.status.toLowerCase() !== "requested" ||
                    isAccepting ||
                    isRejecting
                  }
                  onClick={handleReject}
                >
                  {isRejecting ? "Rejecting..." : "Reject Booking"}
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 text-xs py-2 font-medium"
                  disabled={
                    booking.status.toLowerCase() !== "requested" ||
                    isAccepting ||
                    isRejecting
                  }
                  onClick={handleAccept}
                >
                  {isAccepting ? "Accepting..." : "Accept Booking"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
