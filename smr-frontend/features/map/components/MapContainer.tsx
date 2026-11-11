"use client";

import { useMap } from "@/features/map/hooks/useMap";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  enableLocationTracking?: boolean;
};

export function MapContainer({
  className,
  enableLocationTracking = false,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapService = useMap();

  useEffect(() => {
    async function setupMap() {
      if (mapRef.current) {
        try {
          await mapService.initialise(mapRef.current);
          if (enableLocationTracking) {
            await mapService.startLocationTracking();
          }
        } catch (err) {
          console.warn("Map setup or location tracking warning:", err);
        }
      }
    }

    setupMap();

    // add cleanup function
    return () => {
      mapService.destroy();
    };
  }, [mapService, enableLocationTracking]);

  const defaultMapStyles = "h-full w-full";

  return <div ref={mapRef} className={cn(defaultMapStyles, className)}></div>;
}
