"use client";

import { useState } from "react";
import { Tag } from "@sharemyride/ui";
import { Clock, Route, Users } from "lucide-react";
import { JourneyStatus, TripStopDTO } from "@sharemyride/shared";

interface NavigationDrawerHeaderProps {
  journeyStatus: JourneyStatus;
  origin: TripStopDTO;
  destination: TripStopDTO;
  passengerCount: number;
}

export function NavigationDrawerHeader({
  journeyStatus,
  origin,
  destination,
  passengerCount,
}: NavigationDrawerHeaderProps) {
  const [status] = useState(journeyStatus);
  const [originStop] = useState(origin);
  const [destinationStop] = useState(destination);
  const [count] = useState(passengerCount);

  return (
    <div className="p-4 border-b border-border-subtle bg-surface-base shrink-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-content-primary min-w-0">
          {originStop.stop_name} → {destinationStop.stop_name}
        </p>
        <Tag variant={status === JourneyStatus.ONGOING ? "accent" : "muted"}>
          {status === JourneyStatus.ONGOING ? "On Route" : "Completed"}
        </Tag>
      </div>
      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-content-secondary">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{status === JourneyStatus.ONGOING ? "In Progress" : "Ended"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>{count} Passengers</span>
        </div>
      </div>
    </div>
  );
}
