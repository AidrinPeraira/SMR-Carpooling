"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/components/UserInput/Pagination";
import { getDriverBookingsRequest } from "../api/getDriverBookingsRequest";
import { DriverBookingsHeader } from "../components/DriverBookingsHeader";
import { DriverBookingsCard } from "../components/DriverBookingsCard";
import { Button, Loader } from "@sharemyride/ui";

export function DriverBookingsView() {
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["driverBookings", statusFilter, page, limit],
    queryFn: () =>
      getDriverBookingsRequest({
        booking_status: statusFilter,
        page,
        limit,
      }),
  });

  const bookings = data?.data || [];
  const paginationMeta = data?.paginationMeta;
  const totalPages = paginationMeta?.totalPages || 1;
  const totalItems = paginationMeta?.totalItems || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <DriverBookingsHeader
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        totalCount={totalItems}
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader />
          <p className="text-sm text-content-secondary animate-pulse">
            Loading bookings...
          </p>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-error-border bg-error-surface p-6 text-center text-error-content my-8">
          <h3 className="font-semibold text-lg">Error Loading Bookings</h3>
          <p className="text-sm mt-1">
            {(error as Error)?.message || "Failed to load bookings."}
          </p>
          <Button
            variant="secondary"
            className="mt-4 text-xs py-1.5 px-3"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && bookings.length === 0 && (
        <div className="rounded-xl border border-border-subtle bg-surface-card p-12 text-center my-8 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-content-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-content-primary">
            No Bookings Found
          </h3>
          <p className="text-sm text-content-secondary mt-1 max-w-sm mx-auto">
            {statusFilter !== "all"
              ? `There are no bookings matching status '${statusFilter}'. Try selecting a different filter.`
              : "Passengers haven't booked any seats for your trips yet."}
          </p>
        </div>
      )}

      {!isLoading && !isError && bookings.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <DriverBookingsCard
                key={booking.booking_id}
                booking={booking}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
