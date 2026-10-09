"use client";

import { useState } from "react";
import { PassengerCard } from "@/features/driver/journey/components/PassengerCard";
import {
  JourneyStatus,
  DriverJourneyPassengerResult,
} from "@sharemyride/shared";

interface PassengerManifestCardProps {
  journeyStatus: JourneyStatus;
  passengers: DriverJourneyPassengerResult[];
}

export function PassengerManifestCard({
  journeyStatus,
  passengers,
}: PassengerManifestCardProps) {
  const [status] = useState(journeyStatus);
  const [passengerList] = useState(passengers);

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[10px] font-bold text-content-secondary tracking-wider uppercase">
          Passenger Manifest
        </h3>
        <span className="text-[10px] text-accent font-bold">
          {passengerList.length} Booking{passengerList.length !== 1 ? "s" : ""}{" "}
          Active
        </span>
      </div>
      <div className="space-y-2.5">
        {passengerList.map((passenger) => (
          <PassengerCard
            key={passenger.passenger_id}
            journeyStatus={status}
            passenger={passenger}
          />
        ))}
      </div>
    </div>
  );
}
