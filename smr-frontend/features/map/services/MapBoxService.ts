import { IMapProviderService } from "@/features/map/services/IMapProviderService";
import { MapPoint, Place } from "@/features/map/types/MapTypes";
import { GeocodingCore } from "@mapbox/search-js-core";
import mapboxgl, { GeolocateControl, Map } from "mapbox-gl";

const MAP_BOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
mapboxgl.accessToken = MAP_BOX_API_KEY;

/**
 * This is the implementation of the mapbox-gl library
 * to provide map rendering services across components
 */
export class MapBoxService implements IMapProviderService {
  private _map: Map | null = null;
  private _styleUrl = "mapbox://styles/mapbox/dark-v11";
  private _geolocationControl: GeolocateControl | null = null;
  private _geocode: GeocodingCore;

  constructor() {
    this._geocode = new GeocodingCore({
      accessToken: MAP_BOX_API_KEY,
    });
  }

  /**
   * Creates a new map instance and sets the center and zoom, resolving when the map style loads
   *
   * @param element : Reference to html element that renders map
   * @param options : optional config for center and zoom
   */
  initialise(
    element: HTMLDivElement,
    options?: {
      center?: MapPoint;
      zoom?: number;
    },
  ): void {
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
  async destroy(): Promise<void> {
    // remove any location tracking first
    await this.stopLocationTracking();

    this._map?.remove();
    this._map = null;
  }

  /**
   * Moves map center to given point
   *
   * @param point : coordinates as MapPoint ([lng, lat])
   */
  async setCenter(point: MapPoint): Promise<void> {
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
  async getCurrentLocation(): Promise<MapPoint> {
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
   * This method renders the default Mapbox marker to show the current
   * user location and also start live tracking
   *
   * @param options : optional config
   */
  async startLocationTracking(): Promise<void> {
    if (!this._map) throw new Error("Map not initialised");

    // create location control if it doesn't exist
    if (!this._geolocationControl) {
      const geoControl = new GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
        showUserLocation: true,
      });

      this._geolocationControl = geoControl;
      // add the location control to the current map instance
      this._map.addControl(this._geolocationControl);

      this._geolocationControl.on("error", (error: any) => {
        console.error("GeolocateControl error:", error);
      });

      this._geolocationControl.on("ready", () => {
        geoControl.trigger();
      });
    } else {
      // trigger location tracking
      this._geolocationControl.trigger();
    }
  }

  /**
   * This method clears any active location tracking listeners
   */
  async stopLocationTracking(): Promise<void> {
    if (this._geolocationControl && this._map) {
      this._map.removeControl(this._geolocationControl);
      this._geolocationControl = null;
    }
  }

  /**
   * This method takes the search string and calls the map box
   * search api and maps the result of sugeested places and returns
   * the array
   *
   * @param place : Place name as string
   * @returns Array of suggested places
   */
  async searchLocation(place: string): Promise<Place[]> {
    const response = await this._geocode.forward(place);

    const result: Place[] = response.features.map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      return {
        id: feature.properties.mapbox_id || feature.id,
        title: feature.properties.name,
        address:
          feature.properties.full_address ||
          feature.properties.place_formatted ||
          feature.properties.name,
        lat,
        lng,
      };
    });

    return result;
  }
}
