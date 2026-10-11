"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Loader } from "@sharemyride/ui";
import { SocketEvents } from "@sharemyride/shared";
import { useLiveLocationSocket } from "@/features/realtime/hooks/useLiveLocationSocket";
import { getPassengerJourneyDetailsRequest } from "../api/getPassengerJourneyDetailsRequest";
import { JourneyStatusHeader } from "../components/JourneyStatusHeader";
import { PassengerJourneyMap } from "../components/PassengerJourneyMap";
import { JourneyStopsProgress } from "../components/JourneyStopsProgress";
import { PassengerDetailsCard } from "../components/PassengerDetailsCard";
import { OtherPassengersCard } from "../components/OtherPassengersCard";

export function PassengerJourneyView() {
  const { journeyId } = useParams<{ journeyId: string }>();

  const journeySocket = useLiveLocationSocket();

  useEffect(() => {
    const onError = (data: { message: string }) => {
      console.error("Journey socket error:", data.message);
    };

    journeySocket.on(SocketEvents.JOURNEY_ERROR, onError);
    journeySocket.emit(SocketEvents.JOURNEY_PASSENGER_JOIN, {
      journey_id: journeyId,
    });

    return () => {
      journeySocket.off(SocketEvents.JOURNEY_ERROR, onError);
    };
  }, [journeySocket, journeyId]);

  const {
    data: journey,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["passengerJourneyDetails", journeyId],
    queryFn: () => getPassengerJourneyDetailsRequest(journeyId),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader />
        <p className="text-sm text-content-secondary animate-pulse">
          Loading journey details...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="rounded-xl border border-error-border bg-error-surface p-6 text-center text-error-content space-y-3">
          <h3 className="font-semibold text-lg">Error Loading Journey</h3>
          <p className="text-sm">
            {(error as Error)?.message || "Could not load journey details."}
          </p>
          <Button
            variant="secondary"
            className="text-xs py-1.5 px-3"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!journey) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
      <JourneyStatusHeader
        journeyId={journey.journey_id}
        journeyStatus={journey.journey_status}
        passengerStatus={journey.my_details.passenger_status}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <PassengerJourneyMap
            journeySocket={journeySocket}
            journey={journey}
          />

          <JourneyStopsProgress
            origin={journey.origin}
            destination={journey.destination}
            intermediateStops={journey.intermediate_stops}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <PassengerDetailsCard myDetails={journey.my_details} />

          <OtherPassengersCard passengers={journey.other_passengers} />
        </div>
      </div>
    </div>
  );
}
