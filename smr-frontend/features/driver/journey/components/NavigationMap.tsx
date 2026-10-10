"use client";

import { useEffect, useState } from "react";
import { MapContainer } from "@/features/map/components/MapContainer";
import { DirectionsCard } from "@/features/driver/journey/components/DirectionsCard";
import { Compass } from "lucide-react";
import {
  JourneyStatus,
  TripStopDTO,
  JourneyStopResult,
} from "@sharemyride/shared";
import { useMap } from "@/features/map/hooks/useMap";
import { MapPoint } from "@/features/map/types/MapTypes";

interface NavigationMapProps {
  journeyStatus: JourneyStatus;
  origin: TripStopDTO;
  destination: TripStopDTO;
  intermediateStops: JourneyStopResult[];
}

export function NavigationMap({
  journeyStatus,
  origin,
  destination,
  intermediateStops,
}: NavigationMapProps) {
  const [mapOrigin] = useState(origin);
  const [mapDestination] = useState(destination);
  const [mapStops] = useState(intermediateStops);

  console.log("Map origin", mapOrigin);

  const [status] = useState(journeyStatus);
  const map = useMap();

  async function handleLocationChange(newLocation: MapPoint) {
    console.log("Moved to location. New Location: ", newLocation);
  }

  useEffect(() => {
    async function setupMap() {
      await map.clearAllMarkers();
      await map.clearAllRoutes();

      const currentLoation = await map.getCurrentLocation();

      const waypoints = [
        currentLoation,
        ...mapStops.map((v) => [v.stop_lng, v.stop_lat]),
        [mapDestination.stop_lng, mapDestination.stop_lat],
      ];
      await map.startNavigation(waypoints as MapPoint[], handleLocationChange);
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
        <DirectionsCard journeyStatus={status} />
      </div>

      <div className="relative z-10 mt-auto p-4 flex items-end justify-end">
        <div className="flex flex-col gap-2">
          <button
            className="w-10 h-10 rounded-full bg-surface-card text-content-primary shadow-md border border-border-subtle flex items-center justify-center active:scale-95 transition-all"
            title="Re-center"
            onClick={() => map.recenterNavigation()}
          >
            <Compass className="w-5 h-5 text-accent" />
          </button>
        </div>
      </div>
    </section>
  );
}
