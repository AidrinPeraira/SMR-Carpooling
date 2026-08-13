"use client";

import { DropDown } from "@sharemyride/ui";

interface PassengerBookingsHeaderProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  totalCount?: number;
}

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Payment Pending", value: "payment_pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

export function PassengerBookingsHeader({
  statusFilter,
  onStatusChange,
  totalCount,
}: PassengerBookingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-content-primary">
          My Bookings
        </h1>
        <p className="text-sm text-content-secondary mt-1">
          Review and track all your carpool trip bookings.
          {typeof totalCount === "number" && (
            <span className="ml-2 inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
              {totalCount} total
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-content-secondary uppercase tracking-wider whitespace-nowrap">
          Filter Status:
        </label>
        <div className="w-48">
          <DropDown
            defaultValue={statusFilter}
            options={STATUS_OPTIONS}
            onChange={(value) => onStatusChange(value)}
          />
        </div>
      </div>
    </div>
  );
}
