"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getDriverTripDetailsRequest } from "../api/getDriverTripDetailsRequest";
import { MapContainer } from "@/features/map/components/MapContainer";
import { useMap } from "@/features/map/hooks/useMap";
import { MapPoint } from "@/features/map/types/MapTypes";
import { Button, Card, Loader, Tag } from "@sharemyride/ui";
import {
  ArrowLeft,
  Calendar,
  Car,
  Users,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface DriverTripDetailsViewProps {
  tripId: string;
}

export function DriverTripDetailsView({ tripId }: DriverTripDetailsViewProps) {
  const map = useMap();

  const {
    data: tripDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["driverTripDetails", tripId],
    queryFn: () => getDriverTripDetailsRequest(tripId),
    enabled: !!tripId,
  });

  // Setup Map Box Route
  useEffect(() => {
    if (!tripDetails) return;
    const currentTrip = tripDetails;

    const setupMapRoutes = async () => {
      try {
        await map.clearAllMarkers();
        await map.clearAllRoutes();

        const originPoint: MapPoint = [
          currentTrip.trip_origin.stop_lng,
          currentTrip.trip_origin.stop_lat,
        ];
        const destPoint: MapPoint = [
          currentTrip.trip_destination.stop_lng,
          currentTrip.trip_destination.stop_lat,
        ];

        try {
          const routeData = await map.getRoute([originPoint, destPoint]);
          if (routeData?.route) {
            await map.drawRoute(routeData.route, {
              id: "driver-trip-route",
              color: "#3b82f6",
              width: 6,
              opacity: 0.95,
            });
          }
        } catch {
          await map.drawRoute([originPoint, destPoint], {
            id: "driver-trip-route",
            color: "#3b82f6",
            width: 6,
          });
        }

        await map.addMarker(originPoint);
        await map.addMarker(destPoint);
        await map.fitBounds([originPoint, destPoint]);
      } catch (err) {
        console.warn("Map setup failed inside setupMapRoutes:", err);
      }
    };

    const timer = setTimeout(() => {
      setupMapRoutes();
    }, 150);

    return () => clearTimeout(timer);
  }, [tripDetails, map]);

  const renderStatusTag = (status?: string) => {
    if (!status) return null;
    const s = status.toLowerCase();
    switch (s) {
      case "scheduled":
        return (
          <Tag
            variant="accent"
            className="bg-accent/15 text-accent border-accent/30"
          >
            SCHEDULED
          </Tag>
        );
      case "ongoing":
        return (
          <Tag
            variant="muted"
            className="bg-warning-surface text-warning-content border-warning-border"
          >
            ONGOING
          </Tag>
        );
      case "completed":
        return (
          <Tag
            variant="accent"
            className="bg-success-surface text-success-content border-success-border"
          >
            COMPLETED
          </Tag>
        );
      case "cancelled":
        return (
          <Tag
            variant="muted"
            className="bg-error-surface text-error-content border-error-border"
          >
            CANCELLED
          </Tag>
        );
      default:
        return <Tag variant="muted">{status.toUpperCase()}</Tag>;
    }
  };

  const renderBookingStatusTag = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "requested":
        return (
          <Tag
            variant="muted"
            className="bg-warning-surface text-warning-content border-warning-border text-xs"
          >
            REQUESTED
          </Tag>
        );
      case "confirmed":
        return (
          <Tag
            variant="accent"
            className="bg-success-surface text-success-content border-success-border text-xs"
          >
            CONFIRMED
          </Tag>
        );
      case "rejected":
      case "cancelled":
        return (
          <Tag
            variant="muted"
            className="bg-error-surface text-error-content border-error-border text-xs"
          >
            {s.toUpperCase()}
          </Tag>
        );
      default:
        return (
          <Tag variant="muted" className="text-xs">
            {status.toUpperCase()}
          </Tag>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader />
        <p className="text-sm text-content-secondary animate-pulse">
          Loading trip details...
        </p>
      </div>
    );
  }

  if (isError || !tripDetails) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="p-8 text-center border border-error-border bg-error-surface space-y-4">
          <div className="w-12 h-12 rounded-full bg-error-surface flex items-center justify-center mx-auto text-error-content">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-error-content">
            Failed to Load Trip Details
          </h2>
          <p className="text-sm text-content-secondary">
            {(error as Error)?.message ||
              "Trip details could not be retrieved."}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/driver/trips">
              <Button variant="secondary" className="text-xs py-2 px-4">
                Back to My Trips
              </Button>
            </Link>
            <Button
              variant="primary"
              className="text-xs py-2 px-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const formattedDate = tripDetails.start_time
    ? new Date(tripDetails.start_time).toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "N/A";

  const bookings = tripDetails.trip_bookings || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      {/* Top Navigation */}
      <div>
        <Link
          href="/driver/trips"
          className="inline-flex items-center gap-2 text-sm text-content-secondary hover:text-content-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Trips
        </Link>
      </div>

      {/* Header Info Banner */}
      <Card className="p-6 border border-border-subtle bg-surface-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-content-primary flex items-center gap-2">
              <span>{tripDetails.trip_origin.stop_name}</span>
              <ArrowRight className="w-5 h-5 text-accent" />
              <span>{tripDetails.trip_destination.stop_name}</span>
            </h1>
            {renderStatusTag(tripDetails.trip_status)}
          </div>
          <p className="text-xs text-content-secondary mt-1 font-mono">
            Trip ID: {tripId}
          </p>
        </div>
      </Card>

      {/* Map Container Card */}
      <Card className="p-2 border border-border-subtle bg-surface-card overflow-hidden rounded-2xl shadow-sm">
        <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-border-subtle relative">
          <MapContainer />
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle & Timing Details */}
        <Card className="p-6 border border-border-subtle bg-surface-card space-y-4">
          <h2 className="text-sm font-semibold text-content-secondary uppercase tracking-wider">
            Vehicle & Schedule
          </h2>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-content-primary">
                {tripDetails.trip_vehicle}
              </p>
              <p className="text-xs text-content-secondary">Assigned Vehicle</p>
            </div>
          </div>

          <div className="border-t border-border-subtle pt-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-content-primary">
                {formattedDate}
              </p>
              <p className="text-xs text-content-secondary">Departure Time</p>
            </div>
          </div>
        </Card>

        {/* Route Stops / Locations */}
        <Card className="p-6 border border-border-subtle bg-surface-card space-y-4">
          <h2 className="text-sm font-semibold text-content-secondary uppercase tracking-wider">
            Route Stops
          </h2>

          <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle">
            {/* Origin */}
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-8 h-8 rounded-full bg-success-surface border border-success-border text-success-content flex items-center justify-center text-xs font-bold shrink-0">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-content-primary">
                  {tripDetails.trip_origin.stop_name}
                </p>
                <p className="text-xs text-content-secondary mt-0.5">
                  {tripDetails.trip_origin.stop_address}
                </p>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                B
              </div>
              <div>
                <p className="text-sm font-semibold text-content-primary">
                  {tripDetails.trip_destination.stop_name}
                </p>
                <p className="text-xs text-content-secondary mt-0.5">
                  {tripDetails.trip_destination.stop_address}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Passengers & Bookings Table Card */}
      <Card className="p-6 border border-border-subtle bg-surface-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-content-secondary uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            Passenger Bookings ({bookings.length})
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center bg-surface-muted/30 rounded-xl border border-border-subtle">
            <p className="text-sm text-content-secondary">
              No passengers have booked this trip yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-border-subtle rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-muted/60 text-content-secondary uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Passenger Name</th>
                  <th className="py-3 px-4 text-center">Seats</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-content-primary">
                {bookings.map((booking) => (
                  <tr
                    key={booking.booking_id}
                    className="hover:bg-surface-muted/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold">
                      {booking.passenger_name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium">
                      {booking.seat_count}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {renderBookingStatusTag(booking.booking_status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/driver/bookings/${booking.booking_id}`}>
                        <Button
                          variant="secondary"
                          className="text-xs py-1 px-3 inline-flex items-center gap-1"
                        >
                          View Details
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Action Card Placeholder */}
      <Card className="p-6 border border-border-subtle bg-surface-card space-y-3">
        <h2 className="text-sm font-semibold text-content-secondary uppercase tracking-wider">
          Trip Action Controls
        </h2>
        <div className="p-6 rounded-xl border border-dashed border-border-subtle bg-surface-muted/30 text-center">
          <p className="text-sm text-content-secondary font-medium">
            Trip Action Controls Placeholder
          </p>
          <p className="text-xs text-content-secondary/70 mt-1">
            Status management actions (e.g. Start Trip, Complete Trip, Cancel
            Trip) will appear here.
          </p>
        </div>
      </Card>
    </div>
  );
}
