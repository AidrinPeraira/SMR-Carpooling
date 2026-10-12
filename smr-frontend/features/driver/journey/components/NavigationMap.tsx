"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer } from "@/features/map/components/MapContainer";
import { DirectionsCard } from "@/features/driver/journey/components/DirectionsCard";
import { Locate } from "lucide-react";
import {
  JourneyStatus,
  TripStopDTO,
  JourneyStopResult,
  StopType,
  SocketEvents,
  UpdateLocationDTO,
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
}

export function NavigationMap({
  journeyId,
  journeySocket,
  journeyStatus,
  origin,
  destination,
  intermediateStops,
}: NavigationMapProps) {
  const [navigationState, setNavigationState] =
    useState<NavigationState | null>(null);
  const [currentLocation, setCurrentLocation] =
    useState<UpdateLocationDTO | null>(null);

  const map = useMap();

  const waypoints: MapPoint[] = useMemo(() => {
    const nextStopIndex = intermediateStops.findIndex(
      (s) => s.arrived_at === null,
    );

    const remainingStops =
      nextStopIndex === -1
        ? []
        : intermediateStops
            .slice(nextStopIndex)
            .map((s) => [s.stop_lng, s.stop_lat] as MapPoint);

    const result: MapPoint[] = [
      [origin.stop_lng, origin.stop_lat],
      ...remainingStops,
      [destination.stop_lng, destination.stop_lat],
    ];
    return result;
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
    }

    setupMap();

    return () => {
      map.stopNavigation();
    };
  }, [map]);

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
