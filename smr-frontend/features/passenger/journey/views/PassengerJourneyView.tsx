"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader, useToast } from "@sharemyride/ui";
import { SocketEvents, PassengerJourneyStatus } from "@sharemyride/shared";
import { useLiveLocationSocket } from "@/features/realtime/hooks/useLiveLocationSocket";
import { getPassengerJourneyDetailsRequest } from "../api/getPassengerJourneyDetailsRequest";
import { JourneyStatusHeader } from "../components/JourneyStatusHeader";
import { PassengerJourneyMap } from "../components/PassengerJourneyMap";
import { JourneyStopsProgress } from "../components/JourneyStopsProgress";
import { PassengerDetailsCard } from "../components/PassengerDetailsCard";
import { OtherPassengersCard } from "../components/OtherPassengersCard";

export function PassengerJourneyView() {
  const { journeyId } = useParams<{ journeyId: string }>();
  const router = useRouter();
  const toast = useToast();

  const {
    data: journey,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["passengerJourneyDetails", journeyId],
    queryFn: () => getPassengerJourneyDetailsRequest(journeyId),
  });

  const isDroppedOff =
    journey?.my_details.passenger_status === PassengerJourneyStatus.DROPPED_OFF;

  const journeySocket = useLiveLocationSocket();

  useEffect(() => {
    if (isDroppedOff || isError) return;

    const onError = (data: { message: string }) => {
      console.error("Journey socket error:", data.message);
    };

    const joinPayload = { journey_id: journeyId };

    const emitJoin = () => {
      journeySocket.emit(SocketEvents.JOURNEY_PASSENGER_JOIN, joinPayload);
    };

    journeySocket.on(SocketEvents.JOURNEY_ERROR, onError);

    if (journeySocket.connected) {
      emitJoin();
    }
    journeySocket.on("connect", emitJoin);

    return () => {
      journeySocket.off(SocketEvents.JOURNEY_ERROR, onError);
      journeySocket.off("connect", emitJoin);
    };
  }, [journeySocket, journeyId, isDroppedOff, isError]);

  useEffect(() => {
    if (isDroppedOff) {
      toast("No active journey found", { variant: "warn" });
      router.replace("/passenger");
    }
  }, [isDroppedOff, toast, router]);

  useEffect(() => {
    if (isError) {
      toast("No active journey found", { variant: "error" });
      router.replace("/passenger");
    }
  }, [isError, toast, router]);

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

  if (isError || !journey || isDroppedOff) return null;

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
          <PassengerDetailsCard journeyId={journey.journey_id} driverId={journey.driver_id} myDetails={journey.my_details} />

          <OtherPassengersCard passengers={journey.other_passengers} />
        </div>
      </div>
    </div>
  );
}
