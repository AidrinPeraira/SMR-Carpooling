"use client";

import Link from "next/link";
import { DriverBookingItem } from "../api/getDriverBookingsRequest";
import { Button, Tag } from "@sharemyride/ui";

interface DriverBookingsCardProps {
  booking: DriverBookingItem;
}

export function DriverBookingsCard({ booking }: DriverBookingsCardProps) {
  const formattedDate = booking.trip_date
    ? new Date(booking.trip_date).toLocaleString(undefined, {
        dateStyle: "medium",
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

  return (
    <div className="w-full rounded-xl border border-border-subtle bg-surface-card p-5 shadow-sm hover:shadow-md transition-all backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Passenger & Trip Info */}
        <div className="lg:w-1/4 space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg tracking-tight text-content-primary">
              {booking.passenger_name}
            </h3>
            {renderStatusTag(booking.status)}
          </div>
          <div className="text-xs text-content-secondary space-y-1">
            <p className="flex items-center gap-1.5 font-medium text-content-primary">
              <svg
                className="w-4 h-4 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formattedDate}
            </p>
            <p className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-content-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                />
              </svg>
              Vehicle:{" "}
              <span className="font-semibold text-content-primary">
                {booking.trip_vehicle}
              </span>
            </p>
          </div>
        </div>

        {/* Middle Column: Route Timeline (Pickup -> Dropoff with full addresses) */}
        <div className="lg:flex-1 border-t lg:border-t-0 lg:border-l border-border-subtle pt-4 lg:pt-0 lg:pl-6">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center mt-1">
              <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/15" />
              <div className="w-0.5 h-10 bg-border-subtle my-1" />
              <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/15" />
            </div>
            <div className="flex-1 space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-content-secondary">
                  Pickup Point
                </p>
                <p className="font-bold text-content-primary">
                  {booking.pickup_point_name}
                </p>
                {booking.pickup_point_address && (
                  <p className="text-xs text-content-secondary line-clamp-1 mt-0.5">
                    {booking.pickup_point_address}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-content-secondary">
                  Drop-off Point
                </p>
                <p className="font-bold text-content-primary">
                  {booking.drop_off_point_name}
                </p>
                {booking.drop_off_point_address && (
                  <p className="text-xs text-content-secondary line-clamp-1 mt-0.5">
                    {booking.drop_off_point_address}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats Summary & Action */}
        <div className="lg:w-1/4 border-t lg:border-t-0 lg:border-l border-border-subtle pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between gap-3">
          <div className="grid grid-cols-3 gap-2 text-center bg-surface-muted rounded-lg p-3 text-xs">
            <div>
              <span className="text-content-secondary block">Distance</span>
              <span className="font-semibold text-content-primary">
                {booking.booking_distance} km
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">Seats</span>
              <span className="font-semibold text-content-primary">
                {booking.seat_count} seat(s)
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">Total Price</span>
              <span className="font-bold text-accent">
                ₹{booking.total_price}
              </span>
            </div>
          </div>

          <Link
            href={`/driver/bookings/${booking.booking_id}`}
            className="w-full"
          >
            <Button variant="secondary" className="w-full text-xs py-2">
              View Details →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
