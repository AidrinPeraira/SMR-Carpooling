"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { NavigationDrawerHeader } from "@/features/driver/journey/components/NaavigationDrawerHeader";
import { CurrentTargetCard } from "@/features/driver/journey/components/CurrentTargetCard";
import { PassengerManifestCard } from "@/features/driver/journey/components/PassnegerManifestCard";
import {
  JourneyStatus,
  TripStopDTO,
  JourneyStopResult,
  DriverJourneyPassengerResult,
} from "@sharemyride/shared";

interface NavigationDrawerProps {
  journeyId: string;
  journeyStatus: JourneyStatus;
  origin: TripStopDTO;
  destination: TripStopDTO;
  passengers: DriverJourneyPassengerResult[];
  intermediateStops: JourneyStopResult[];
  onStartNavigation: () => void;
}

export function NavigationDrawer({
  journeyId,
  journeyStatus,
  origin,
  destination,
  passengers,
  intermediateStops,
  onStartNavigation,
}: NavigationDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-20 bg-surface-card border-t border-border-strong rounded-t-2xl shadow-2xl transition-all duration-300 ${
        isOpen ? "max-h-[90vh]" : ""
      } lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:max-h-full lg:h-full lg:w-[420px] xl:w-[460px] lg:flex-shrink-0 lg:rounded-none lg:border-t-0 lg:border-l lg:shadow-none lg:z-auto flex flex-col`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2.5 px-4 flex items-center justify-between text-xs font-semibold text-content-secondary border-b border-border-subtle bg-surface-muted/50 rounded-t-2xl lg:hidden cursor-pointer hover:bg-surface-muted transition-colors shrink-0"
      >
        <div className="flex items-center gap-2">
          <span className="w-8 h-1 bg-border-strong rounded-full inline-block" />
          <span>{isOpen ? "Collapse" : "Trip Details"}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>

      <NavigationDrawerHeader
        journeyStatus={journeyStatus}
        origin={origin}
        destination={destination}
        passengerCount={passengers.length}
      />

      <div
        className={`overflow-y-auto flex-1 p-4 space-y-4 ${
          isOpen ? "" : "hidden lg:block"
        }`}
      >
        <CurrentTargetCard
          journeyId={journeyId}
          journeyStatus={journeyStatus}
          intermediateStops={intermediateStops}
          passengers={passengers}
          onStartNavigation={onStartNavigation}
        />
        <PassengerManifestCard
          journeyStatus={journeyStatus}
          passengers={passengers}
        />
      </div>
    </div>
  );
}
