"use client";

import { PassengerCard } from "@/features/driver/journey/components/PassengerCard";
import {
  JourneyStatus,
  DriverJourneyPassengerResult,
} from "@sharemyride/shared";

interface PassengerManifestCardProps {
  journeyId: string;
  journeyStatus: JourneyStatus;
  passengers: DriverJourneyPassengerResult[];
}

export function PassengerManifestCard({
  journeyId,
  journeyStatus,
  passengers,
}: PassengerManifestCardProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[10px] font-bold text-content-secondary tracking-wider uppercase">
          Passenger Manifest
        </h3>
        <span className="text-[10px] text-accent font-bold">
          {passengers.length} Booking{passengers.length !== 1 ? "s" : ""}{" "}
          Active
        </span>
      </div>
      <div className="space-y-2.5">
        {passengers.map((passenger) => (
          <PassengerCard
            key={passenger.passenger_id}
            journeyId={journeyId}
            journeyStatus={journeyStatus}
            passenger={passenger}
          />
        ))}
      </div>
    </div>
  );
}
