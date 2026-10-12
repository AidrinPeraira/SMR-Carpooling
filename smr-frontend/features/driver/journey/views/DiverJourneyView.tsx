"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDriverJourneyDetailsRequest } from "@/features/driver/journey/api/getDriverJourneyDetailsRequest";
import { useLiveLocationSocket } from "@/features/realtime/hooks/useLiveLocationSocket";
import { NavigationDrawer } from "@/features/driver/journey/components/NavigationDrawer";
import { NavigationMap } from "@/features/driver/journey/components/NavigationMap";
import { Loader, useToast } from "@sharemyride/ui";
import {
  GetDriverJourneyDetailsResult,
  JourneyStatus,
  SocketEvents,
} from "@sharemyride/shared";

interface DriverJourneyViewProps {
  journeyId: string;
}

export function DriverJourneyView({ journeyId }: DriverJourneyViewProps) {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const journeySocket = useLiveLocationSocket();

  const {
    data: journey,
    isLoading,
    isError,
  } = useQuery<GetDriverJourneyDetailsResult>({
    queryKey: ["driverJourneyDetails", journeyId],
    queryFn: () => getDriverJourneyDetailsRequest(journeyId),
    enabled: !!journeyId,
  });

  const isCompleted = journey?.journey_status === JourneyStatus.COMPLETED;

  useEffect(() => {
    if (isCompleted || isError) return;

    journeySocket.emit(SocketEvents.JOURNEY_DRIVER_JOIN, {
      journey_id: journeyId,
    });
  }, [journeySocket, journeyId, isCompleted, isError]);

  useEffect(() => {
    if (isCompleted) {
      toast("No active journey found", { variant: "warn" });
      router.replace("/driver");
    }
  }, [isCompleted, toast, router]);

  useEffect(() => {
    if (isError) {
      toast("No active journey found", { variant: "error" });
      router.replace("/driver");
    }
  }, [isError, toast, router]);

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

  if (isError || !journey || isCompleted) return null;

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
        />
      </div>
      <NavigationDrawer
        journeyId={journeyId}
        journeyStatus={journey.journey_status}
        origin={journey.origin}
        destination={journey.destination}
        passengers={journey.passengers}
        intermediateStops={journey.intermediate_stops}
        onStartNavigation={() => {
          queryClient.invalidateQueries({
            queryKey: ["driverJourneyDetails", journeyId],
          });
        }}
        onCompleteAndExit={() => {
          router.push("/driver");
        }}
        onCompleteAndContinue={() => {
          queryClient.invalidateQueries({
            queryKey: ["driverJourneyDetails", journeyId],
          });
        }}
      />
    </div>
  );
}
