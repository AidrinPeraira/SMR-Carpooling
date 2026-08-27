"use client";

import { Button, Card } from "@sharemyride/ui";
import { MessageSquare, Phone } from "lucide-react";

interface Booking {
  booking_id: string;
  passenger_name: string;
  booking_status: string;
}

interface DriverTripCommunicationCardProps {
  bookings: Booking[];
}

export function DriverTripCommunicationCard({
  bookings,
}: DriverTripCommunicationCardProps) {
  const confirmedBookings = bookings.filter(
    (b) => b.booking_status.toLowerCase() === "confirmed"
  );

  return (
    <Card className="p-6 border border-border-subtle bg-surface-card space-y-4 flex flex-col">
      <div>
        <h2 className="text-sm font-semibold text-content-secondary uppercase tracking-wider">
          Passenger Communication
        </h2>
        <p className="text-xs text-content-secondary mt-2">
          Coordinate with your passengers via group chat or call them directly.
        </p>
      </div>

      <div className="pt-2">
        <Button
          variant="secondary"
          className="w-full text-xs py-2 font-medium flex items-center justify-center gap-2"
          onClick={() => alert("Trip chat feature coming soon!")}
        >
          <MessageSquare className="w-4 h-4" />
          Open Trip Chat
        </Button>
      </div>

      {confirmedBookings.length > 0 && (
        <div className="pt-4 border-t border-border-subtle mt-2 flex-1">
          <h3 className="text-xs font-semibold text-content-secondary mb-3">
            Confirmed Passengers
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {confirmedBookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="flex items-center justify-between p-2 rounded-lg border border-border-subtle bg-surface-muted/30"
              >
                <span className="text-sm font-medium text-content-primary truncate mr-2">
                  {booking.passenger_name}
                </span>
                <Button
                  variant="secondary"
                  className="text-xs py-1 px-3 flex items-center gap-1.5 shrink-0"
                  onClick={() => alert(`Calling ${booking.passenger_name}...`)}
                >
                  <Phone className="w-3 h-3" />
                  Call
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
