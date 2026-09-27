"use client";

import Link from "next/link";
import { Card, Tag, Button } from "@sharemyride/ui";
import { RecentBookingResult } from "@sharemyride/shared";
import { CircleDot, MapPin } from "lucide-react";

interface DriverOverviewBookingsCardProps {
  bookings: RecentBookingResult[];
}

export function DriverOverviewBookingsCard({
  bookings,
}: DriverOverviewBookingsCardProps) {
  return (
    <Card className="p-5 md:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-content-primary">
          Recent Bookings
        </h2>
        <Link href="/driver/bookings">
          <Button variant="secondary" className="text-xs py-1.5 px-3">
            View All
          </Button>
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center text-center gap-2 bg-surface-muted/40 rounded-xl border border-dashed border-border-subtle">
          <p className="text-sm font-semibold text-content-primary">
            No Bookings Yet
          </p>
          <p className="text-xs text-content-secondary max-w-xs">
            Confirmed bookings from passengers will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border-subtle border border-border-subtle rounded-xl overflow-hidden bg-surface-card">
          {bookings.map((booking) => (
            <Link
              key={booking.booking_id}
              href={`/driver/bookings/${booking.booking_id}`}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-base/50 transition-colors"
            >
              <div className="flex gap-3 min-w-0 flex-1">
                <div className="flex flex-col items-center pt-0.5 shrink-0">
                  <CircleDot className="w-3.5 h-3.5 text-accent" />
                  <div className="w-0.5 h-5 bg-border-strong my-0.5" />
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-content-primary truncate">
                    {booking.pickup}
                  </p>
                  <p className="text-sm text-content-secondary truncate mt-1">
                    {booking.drop_off}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0">
                <span className="text-content-secondary">
                  {booking.passenger_name}
                </span>
                <span className="text-content-secondary">
                  {booking.seat_count} seat{booking.seat_count > 1 ? "s" : ""}
                </span>
                <span className="font-bold text-accent">
                  ₹{booking.total_price}
                </span>
                <Tag
                  variant="accent"
                  className="bg-success-surface text-success-content border-success-border text-xs"
                >
                  {booking.status.toUpperCase()}
                </Tag>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
