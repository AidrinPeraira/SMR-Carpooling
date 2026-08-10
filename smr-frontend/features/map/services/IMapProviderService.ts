"use client";
import { MapPoint } from "@/features/map/types/MapTypes";

/**
 * This interface defines the methods needed for any
 * map service that is used to render the map component
 */
export interface IMapProviderService {
  initialise(
    element: HTMLDivElement,
    options?: {
      center?: MapPoint;
      zoom?: number;
    },
  ): void;

  destroy(): void;

  setCenter(point: MapPoint): void;

  getCurrentLocation(): Promise<MapPoint>;

  centerOnUserLocation(): Promise<void>;
}
