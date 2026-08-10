import { MapContext } from "@/features/map/context/MapContext";
import { IMapProviderService } from "@/features/map/services/IMapProviderService";
import { useContext } from "react";

/**
 * This is a reusable hook that returns the map context
 * It ensures the component exists
 */
export function useMap(): IMapProviderService {
  const context = useContext<IMapProviderService>(MapContext);

  if (!context) {
    throw new Error("Map context not found. Use hook in provider.");
  }

  return context;
}
