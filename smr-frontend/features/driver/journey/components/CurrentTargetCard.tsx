"use client";

import { useState } from "react";
import { Card, Button, Avatar } from "@sharemyride/ui";
import { Clock, MapPin, Phone, MessageSquare, CheckCircle } from "lucide-react";
import {
  JourneyStatus,
  JourneyStopResult,
  DriverJourneyPassengerResult,
  PassengerJourneyStatus,
  StopType,
} from "@sharemyride/shared";

interface CurrentTargetCardProps {
  journeyStatus: JourneyStatus;
  intermediateStops: JourneyStopResult[];
  passengers: DriverJourneyPassengerResult[];
}

export function CurrentTargetCard({
  journeyStatus,
  intermediateStops,
  passengers,
}: CurrentTargetCardProps) {
  const [status] = useState(journeyStatus);
  const [stops] = useState(intermediateStops);
  const [passengerList] = useState(passengers);

  const nextStop = stops.find((stop) => {
    const passenger = passengerList.find(
      (p) => p.passenger_id === stop.passenger_id,
    );
    if (!passenger) return false;
    if (
      stop.stop_type === StopType.PICKUP &&
      passenger.passenger_status === PassengerJourneyStatus.NOT_BOARDED
    )
      return true;
    if (
      stop.stop_type === StopType.DROPOFF &&
      passenger.passenger_status === PassengerJourneyStatus.PICKED_UP
    )
      return true;
    return false;
  });

  const nextPassenger = nextStop
    ? passengerList.find((p) => p.passenger_id === nextStop.passenger_id)
    : null;

  if (!nextStop || !nextPassenger || status !== JourneyStatus.ONGOING) {
    return null;
  }

  const isPickup = nextStop.stop_type === StopType.PICKUP;
  const initials = nextPassenger.passenger_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="p-4 border-2 border-accent relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-accent text-accent-fg text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
        Current Target
      </div>

      <div className="pr-20">
        <span className="text-[10px] font-bold text-accent tracking-wider uppercase">
          Next: {isPickup ? "Pickup" : "Drop-off"}
        </span>
        <h2 className="text-sm font-bold text-content-primary mt-0.5">
          {nextStop.stop_name}
        </h2>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-content-secondary">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{nextStop.stop_address}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar initials={initials} size="sm" />
          <div>
            <p className="text-sm font-bold text-content-primary">
              {nextPassenger.passenger_name}
            </p>
            <p className="text-[10px] text-content-secondary font-medium">
              {isPickup ? "Awaiting pickup" : "Onboard"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            className="w-8 h-8 rounded-full bg-surface-muted hover:bg-surface-secondary flex items-center justify-center text-content-primary transition-colors"
            title={`Call ${nextPassenger.passenger_name}`}
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-surface-muted hover:bg-surface-secondary flex items-center justify-center text-content-primary transition-colors"
            title={`Chat with ${nextPassenger.passenger_name}`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Button
        variant="primary"
        className="mt-4 w-full py-2.5 rounded-full flex items-center justify-center gap-2 font-bold"
      >
        <CheckCircle className="w-4 h-4" />
        <span>{isPickup ? "Arrived at Pickup" : "Arrived at Drop-off"}</span>
      </Button>
    </Card>
  );
}
