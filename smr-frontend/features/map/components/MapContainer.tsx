"use client";
import { useMap } from "@/features/map/hooks/useMap";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type Props = {
  className?: string;
};

export function MapContainer({ className }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapService = useMap();

  useEffect(() => {
    async function setupMap() {
      if (mapRef.current) {
        mapService.initialise(mapRef.current);
        await mapService.startLocationTracking();
      }
    }

    setupMap();

    // add cleanup function
    return () => {
      mapService.destroy();
    };
  }, [mapService]);

  const defaultMapStyles = "h-full w-full";

  return <div ref={mapRef} className={cn(defaultMapStyles, className)}></div>;
}
