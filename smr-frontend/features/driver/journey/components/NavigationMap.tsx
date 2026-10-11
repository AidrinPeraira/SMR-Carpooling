"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer } from "@/features/map/components/MapContainer";
import { DirectionsCard } from "@/features/driver/journey/components/DirectionsCard";
import { Locate } from "lucide-react";
import {
  JourneyStatus,
  TripStopDTO,
  JourneyStopResult,
  DriverJourneyPassengerResult,
  StopType,
  SocketEvents,
  UpdateLocationDTO,
  PassengerJourneyStatus,
} from "@sharemyride/shared";
import { useMap } from "@/features/map/hooks/useMap";
import { MapPoint, NavigationState } from "@/features/map/types/MapTypes";
import { Socket } from "socket.io-client";

interface NavigationMapProps {
  journeyId: string;
  journeySocket: Socket;
  journeyStatus: JourneyStatus;
  origin: TripStopDTO;
  destination: TripStopDTO;
  intermediateStops: JourneyStopResult[];
  passengers: DriverJourneyPassengerResult[];
}

function findCurrentTargetIndex(
  stops: JourneyStopResult[],
  passengers: DriverJourneyPassengerResult[],
): number {
  return stops.findIndex((stop) => {
    const passenger = passengers.find(
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
}

export function NavigationMap({
  journeyId,
  journeySocket,
  journeyStatus,
  origin,
  destination,
  intermediateStops,
  passengers,
}: NavigationMapProps) {
  const [navigationState, setNavigationState] =
    useState<NavigationState | null>(null);
  const [currentLocation, setCurrentLocation] =
    useState<UpdateLocationDTO | null>(null);

  const map = useMap();
  const navigationStartedRef = useRef(false);

  const currentTargetIndex = useMemo(
    () => findCurrentTargetIndex(intermediateStops, passengers),
    [intermediateStops, passengers],
  );

  const waypoints: MapPoint[] = useMemo(() => {
    const points: MapPoint[] = [
      [origin.stop_lng, origin.stop_lat],
      ...intermediateStops.map((s) => [s.stop_lng, s.stop_lat] as MapPoint),
      [destination.stop_lng, destination.stop_lat],
    ];
    return points;
  }, [origin, intermediateStops, destination]);

  const handleLocationChange = useCallback(
    async (newLocation: MapPoint) => {
      const payload: UpdateLocationDTO = {
        journey_id: journeyId,
        lat: newLocation[1],
        lng: newLocation[0],
        heading: 0,
        speed: 0,
        timestamp: Date.now(),
      };
      setCurrentLocation(payload);
    },
    [journeyId],
  );

  const handleNavigationStateChange = useCallback((state: NavigationState) => {
    setNavigationState(state);
  }, []);

  useEffect(() => {
    if (!currentLocation) return;
    journeySocket.emit(SocketEvents.JOURNEY_LOCATION_UPDATE, currentLocation);
  }, [journeySocket, currentLocation]);

  useEffect(() => {
    async function setupMap() {
      await map.clearAllMarkers();
      await map.clearAllRoutes();

      for (const stop of intermediateStops) {
        const point: MapPoint = [stop.stop_lng, stop.stop_lat];
        const stopLabel =
          stop.stop_type === StopType.PICKUP ? "Pickup" : "Drop off";
        await map.addMarkerWithLabel(
          point,
          `${stop.passenger_name} · ${stopLabel}`,
          100,
        );
      }

      await map.startNavigation(
        waypoints,
        handleLocationChange,
        handleNavigationStateChange,
      );
      navigationStartedRef.current = true;
    }

    setupMap();

    return () => {
      map.stopNavigation();
      navigationStartedRef.current = false;
    };
  }, [map]);

  const prevTargetIndexRef = useRef(currentTargetIndex);
  useEffect(() => {
    if (!navigationStartedRef.current) return;
    if (prevTargetIndexRef.current === currentTargetIndex) return;

    prevTargetIndexRef.current = currentTargetIndex;
    map.advanceToNextSegment();
  }, [currentTargetIndex, map]);

  return (
    <section className="relative h-full w-full flex flex-col">
      <div className="absolute inset-0">
        <MapContainer />
      </div>

      <div className="relative z-10 p-4 max-w-xl">
        <DirectionsCard
          journeyStatus={journeyStatus}
          navigationState={navigationState}
        />
      </div>

      <div className="relative z-10 mt-auto mb-28 lg:mb-0 p-4 flex items-end justify-end">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card text-content-primary text-xs font-medium shadow-md border border-border-subtle active:scale-95 transition-all"
          onClick={() => map.recenterNavigation()}
        >
          <Locate className="w-3.5 h-3.5 text-accent" />
          Re-Center
        </button>
      </div>
    </section>
  );
}
