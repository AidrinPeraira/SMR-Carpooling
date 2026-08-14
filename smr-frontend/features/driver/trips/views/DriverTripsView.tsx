"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  getDriverTripsRequest,
  DriverTripItem,
} from "../api/getDriverTripsRequest";
import { Button, Card, DropDown, Loader, Tag } from "@sharemyride/ui";
import { Calendar, Car, ArrowRight, PlusCircle } from "lucide-react";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function DriverTripsView() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["driverTrips", statusFilter, page, limit],
    queryFn: () =>
      getDriverTripsRequest({
        trip_status: statusFilter,
        page,
        limit,
      }),
  });

  const trips = data?.data || [];
  const paginationMeta = data?.paginationMeta;
  const totalPages = paginationMeta?.totalPages || 1;
  const totalItems = paginationMeta?.totalItems || 0;

  const renderStatusTag = (status: string) => {
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content-primary">
            My Created Trips
          </h1>
          <p className="text-sm text-content-secondary mt-1 flex items-center gap-2">
            Manage and track all carpool trips you are driving.
            {typeof totalItems === "number" && (
              <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
                {totalItems} total
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/driver/trips/new-trip">
            <Button
              variant="primary"
              className="text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Offer New Trip
            </Button>
          </Link>
          <div className="w-44">
            <DropDown
              defaultValue={statusFilter}
              options={STATUS_OPTIONS}
              onChange={(value) => handleStatusChange(value)}
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader />
          <p className="text-sm text-content-secondary animate-pulse">
            Fetching driver trips...
          </p>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-error-border bg-error-surface p-6 text-center text-error-content space-y-3">
          <h3 className="font-semibold text-lg">Error Loading Trips</h3>
          <p className="text-sm">
            {(error as Error)?.message || "Failed to load trips."}
          </p>
          <Button
            variant="secondary"
            className="text-xs py-1.5 px-3"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && trips.length === 0 && (
        <Card className="p-12 text-center my-6 border border-border-subtle bg-surface-card">
          <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-4">
            <Car className="w-6 h-6 text-content-secondary" />
          </div>
          <h3 className="font-semibold text-lg text-content-primary">
            No Trips Found
          </h3>
          <p className="text-sm text-content-secondary mt-1 max-w-sm mx-auto">
            {statusFilter !== "all"
              ? `No trips found matching status '${statusFilter}'.`
              : "You haven't offered any carpool trips yet."}
          </p>
          <Link href="/driver/trips/new" className="inline-block mt-4">
            <Button variant="secondary" className="text-xs py-2 px-4">
              Offer a Trip Now
            </Button>
          </Link>
        </Card>
      )}

      {!isLoading && !isError && trips.length > 0 && (
        <>
          <Card className="border border-border-subtle bg-surface-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-muted/60 text-xs uppercase tracking-wider text-content-secondary">
                    <th className="py-3.5 px-4 font-semibold">Route</th>
                    <th className="py-3.5 px-4 font-semibold">Vehicle</th>
                    <th className="py-3.5 px-4 font-semibold">
                      Departure Time
                    </th>
                    <th className="py-3.5 px-4 font-semibold text-center">
                      Vacant / Seats
                    </th>
                    <th className="py-3.5 px-4 font-semibold text-center">
                      Status
                    </th>
                    <th className="py-3.5 px-4 font-semibold text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-content-primary text-xs">
                  {trips.map((trip: DriverTripItem) => {
                    const formattedDate = trip.start_time
                      ? new Date(trip.start_time).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "N/A";

                    return (
                      <tr
                        key={trip.trip_id}
                        className="hover:bg-surface-muted/40 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 font-bold text-sm text-content-primary">
                            <span>{trip.trip_origin}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                            <span>{trip.trip_destination}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {trip.vehicle_make} {trip.vehicle_model}
                        </td>
                        <td className="py-4 px-4 text-content-secondary">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-accent" />
                            {formattedDate}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-semibold">
                          <span className="text-accent">
                            {trip.vacant_seats}
                          </span>{" "}
                          / {trip.available_seats}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {renderStatusTag(trip.trip_status)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link href={`/driver/trips/${trip.trip_id}`}>
                            <Button
                              variant="secondary"
                              className="text-xs py-1 px-3"
                            >
                              View Details →
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border-subtle pt-6">
              <p className="text-xs text-content-secondary">
                Showing Page{" "}
                <span className="font-semibold text-content-primary">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-content-primary">
                  {totalPages}
                </span>{" "}
                ({totalItems} total trips)
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="text-xs py-1 px-3"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <span className="text-xs px-2 font-medium text-content-primary">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  className="text-xs py-1 px-3"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
