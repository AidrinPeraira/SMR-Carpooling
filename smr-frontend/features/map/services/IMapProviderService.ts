"use client";
import {
  MapPoint,
  Place,
  Route,
  SearchSuggestion,
} from "@/features/map/types/MapTypes";

export interface RouteDrawOptions {
  id?: string;
  color?: string;
  width?: number;
  opacity?: number;
}

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

  drawRoute(route: MapPoint[], options?: RouteDrawOptions): Promise<void>;

  /**
   * Renders a route line given an array of lat/long objects or coordinate tuples
   *
   * @param coordinates Array of { lat, lng } objects or [number, number] tuples
   * @param options Optional route drawing styling and ID
   */
  drawRouteFromCoordinates(
    coordinates: { lat: number; lng: number }[] | [number, number][],
    options?: RouteDrawOptions,
  ): Promise<void>;

  removeRoute(id?: string): Promise<void>;

  clearAllRoutes(): Promise<void>;

  fitBounds(points: MapPoint[]): Promise<void>;
}
