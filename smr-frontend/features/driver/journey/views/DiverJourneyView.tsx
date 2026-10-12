"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDriverJourneyDetailsRequest } from "@/features/driver/journey/api/getDriverJourneyDetailsRequest";
import { useLiveLocationSocket } from "@/features/realtime/hooks/useLiveLocationSocket";
import { NavigationDrawer } from "@/features/driver/journey/components/NavigationDrawer";
import { NavigationMap } from "@/features/driver/journey/components/NavigationMap";
import { Loader } from "@sharemyride/ui";
import {
  GetDriverJourneyDetailsResult,
  SocketEvents,
} from "@sharemyride/shared";

interface DriverJourneyViewProps {
  journeyId: string;
}

export function DriverJourneyView({ journeyId }: DriverJourneyViewProps) {
  const journeySocket = useLiveLocationSocket();

  useEffect(() => {
    journeySocket.emit(SocketEvents.JOURNEY_DRIVER_JOIN, {
      journey_id: journeyId,
    });
  }, [journeySocket, journeyId]);

  const {
    data: journey,
    isLoading,
    isError,
    error,
  } = useQuery<GetDriverJourneyDetailsResult>({
    queryKey: ["driverJourneyDetails", journeyId],
    queryFn: () => getDriverJourneyDetailsRequest(journeyId),
    enabled: !!journeyId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <Loader />
        <p className="text-sm text-content-secondary animate-pulse">
          Loading journey...
        </p>
      </div>
    );
  }

  if (isError || !journey) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
        <p className="text-sm font-semibold text-error-content">
          Failed to load journey
        </p>
        <p className="text-xs text-content-secondary">
          {(error as Error)?.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden">
      <div className="absolute inset-0 lg:relative lg:inset-auto flex-1 h-full w-full">
        <NavigationMap
          journeyId={journeyId}
          journeySocket={journeySocket}
          journeyStatus={journey.journey_status}
          origin={journey.origin}
          destination={journey.destination}
          intermediateStops={journey.intermediate_stops}
          passengers={journey.passengers}
        />
      </div>
      <NavigationDrawer
        journeyId={journeyId}
        journeyStatus={journey.journey_status}
        origin={journey.origin}
        destination={journey.destination}
        passengers={journey.passengers}
        intermediateStops={journey.intermediate_stops}
      />
    </div>
  );
}
