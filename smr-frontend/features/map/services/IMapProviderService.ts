"use client";
import { MapPoint, Place, Route, SearchSuggestion } from "@/features/map/types/MapTypes";

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

  /**
   * This method searches for a place and returns suggestions
   *
   * @param place : Searched place as a string
   * @returns Array of search suggestions
   */
  searchSuggestions(place: string): Promise<SearchSuggestion[]>;

  /**
   * This method retrieves full place details including coordinates for a given suggestion
   *
   * @param suggestion : SearchSuggestion item
   * @returns Place object containing coordinates
   */
  getPlaceDetails(suggestion: SearchSuggestion): Promise<Place>;

  addMarker(point: MapPoint): Promise<void>;

  removeMarker(point: MapPoint): Promise<void>;

  clearAllMarkers(): Promise<void>;

  getRoute(waypoints: MapPoint[]): Promise<Route>;

  drawRoute(route: MapPoint[]): Promise<void>;

  removeRoute(): Promise<void>;

  fitBounds(points: MapPoint[]): Promise<void>;
}
