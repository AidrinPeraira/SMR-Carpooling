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
  ): Promise<void>;

  destroy(): Promise<void>;

  setCenter(point: MapPoint): Promise<void>;

  getCurrentLocation(): Promise<MapPoint>;

  /**
   * This method gets the current location of the user
   * and starts listner for updating map marker
   * with live location
   */
  startLocationTracking(): Promise<void>;

  /**
   * This method clears any active live location listners
   */
  stopLocationTracking(): Promise<void>;

  // searchLocation(place: string): Promise<Waypoint[]>;
}
