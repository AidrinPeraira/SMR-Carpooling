"use client";

import { MapContext } from "@/features/map/context/MapContext";
import { MapBoxService } from "@/features/map/services/MapBoxService";
import { ReactNode, useMemo } from "react";

type Props = {
  children: ReactNode;
};

/**
 * This provider componentn allows accessing the map instance
 * across all components.
 */
export function MapProvider({ children }: Props) {
  const mapService = useMemo(() => {
    return new MapBoxService();
  }, []);

  return (
    <MapContext.Provider value={mapService}>{children}</MapContext.Provider>
  );
}
