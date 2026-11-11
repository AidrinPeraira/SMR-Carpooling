import { Card, CardBody, Avatar } from "@sharemyride/ui";
import { PassengerPeerResult } from "@sharemyride/shared";
import { Users, MapPin, Navigation } from "lucide-react";

interface OtherPassengersCardProps {
  passengers: PassengerPeerResult[];
}

export function OtherPassengersCard({
  passengers,
}: OtherPassengersCardProps) {
  if (passengers.length === 0) {
    return null;
  }

  return (
    <Card className="border border-border-subtle bg-surface-card shadow-sm">
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-content-secondary" />
            <h3 className="text-sm font-bold text-content-primary">
              Fellow Passengers
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-muted text-content-primary border border-border-subtle">
            {passengers.length} Passenger{passengers.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-3">
          {passengers.map((passenger, i) => (
            <div
              key={i}
              className="bg-surface-muted rounded-lg p-3 border border-border-subtle"
            >
              <div className="flex items-center gap-2 mb-2">
                <Avatar
                  size="sm"
                  initials={passenger.passenger_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                />
                <span className="font-semibold text-sm text-content-primary">
                  {passenger.passenger_name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-content-secondary">
                  <Navigation className="w-3 h-3 text-accent" />
                  <span className="line-clamp-1">
                    {passenger.pickup_location.stop_name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-content-secondary">
                  <MapPin className="w-3 h-3 text-error-content" />
                  <span className="line-clamp-1">
                    {passenger.drop_off_location.stop_name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
