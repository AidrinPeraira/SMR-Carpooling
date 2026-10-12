"use client";

import { Avatar, Tag } from "@sharemyride/ui";
import { CallButton } from "@/features/call/CallButton";
import {
  JourneyStatus,
  DriverJourneyPassengerResult,
  PassengerJourneyStatus,
} from "@sharemyride/shared";

interface PassengerCardProps {
  journeyId: string;
  journeyStatus: JourneyStatus;
  passenger: DriverJourneyPassengerResult;
}

export function PassengerCard({
  journeyId,
  journeyStatus,
  passenger,
}: PassengerCardProps) {
  const initials = passenger.passenger_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const route = `${passenger.pickup_location.stop_name} → ${passenger.drop_off_location.stop_name}`;

  const renderStatus = () => {
    switch (passenger.passenger_status) {
      case PassengerJourneyStatus.NOT_BOARDED:
        return (
          <span className="px-2 py-0.5 rounded bg-warning-surface text-warning-content text-[10px] font-semibold border border-warning-border">
            Pickup pending
          </span>
        );
      case PassengerJourneyStatus.PICKED_UP:
        return <Tag variant="accent">Onboard</Tag>;
      case PassengerJourneyStatus.DROPPED_OFF:
        return (
          <span className="px-2 py-0.5 rounded bg-success-surface text-success-content text-[10px] font-semibold border border-success-border">
            Dropped off
          </span>
        );
      case PassengerJourneyStatus.NO_SHOW:
        return (
          <span className="px-2 py-0.5 rounded bg-error-surface text-error-content text-[10px] font-semibold border border-error-border">
            No show
          </span>
        );
      case PassengerJourneyStatus.ENDED:
        return <Tag variant="muted">Ended</Tag>;
      default:
        return <Tag variant="muted">{passenger.passenger_status}</Tag>;
    }
  };

  return (
    <div className="bg-surface-card rounded-xl p-3.5 border border-border-subtle shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar initials={initials} size="sm" className="shrink-0" />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-content-primary">
              {passenger.passenger_name}
            </h4>
            <p className="text-[10px] text-content-secondary tracking-wide">
              {route}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CallButton
            tripId={journeyId}
            receiverId={passenger.passenger_id}
            variant="ghost"
            className="shrink-0"
          />
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}
