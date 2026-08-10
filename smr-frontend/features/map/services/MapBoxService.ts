import { IMapProviderService } from "@/features/map/services/IMapProviderService";
import { MapPoint } from "@/features/map/types/MapTypes";
import mapboxgl, { Map } from "mapbox-gl";

const MAP_BOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
mapboxgl.accessToken = MAP_BOX_API_KEY;

/**
 * This is the implementation of the mapbox-gl library
 * to provide map rendering services across components
 */
export class MapBoxService implements IMapProviderService {
  private _map: Map | null = null;
  private _styleUrl = "mapbox://styles/mapbox/dark-v11";
  /**
   * Creates a new map instace and sets the center and zoom
   *
   * @param element : Reference to html element that renders map
   * @options : optional config for center and zoom
   */
  initialise(
    element: HTMLDivElement,
    options?: {
      center?: MapPoint;
      zoom?: number;
    },
  ) {
    this._map = new Map({
      container: element,
      style: this._styleUrl,
      center: options?.center || [75.2711, 10.8505],
      zoom: options?.zoom || 12,
    });
  }

  /**
   * This function clears the map instance
   */
  destroy(): void {
    this._map?.remove();
    this._map = null;
  }

  /**
   * Moves map center to given point
   *
   * @param point : coordinates as MapPoint ([lng, lat])
   */
  setCenter(point: MapPoint): void {
    if (!this._map) {
      throw Error("No map initialise");
    }

    this._map.flyTo({
      center: point,
    });
  }

  /**
   * Fetches user's current GPS location via browser Geolocation API
   */
  getCurrentLocation(): Promise<MapPoint> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          resolve([longitude, latitude]);
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  }

  /**
   * Attempts to fly the map to the user's current location
   */
  async centerOnUserLocation(): Promise<void> {
    try {
      const coords = await this.getCurrentLocation();
      this.setCenter(coords);
    } catch (error) {
      console.warn(
        "Could not retrieve user location, using default center.",
        error,
      );
    }
  }
}
