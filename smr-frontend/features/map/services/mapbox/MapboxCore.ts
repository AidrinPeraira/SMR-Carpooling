import { MapPoint } from "@/features/map/types/MapTypes";
import mapboxgl, { GeolocateControl, Map as MapboxMap } from "mapbox-gl";

const MAP_BOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
mapboxgl.accessToken = MAP_BOX_API_KEY;

const STYLE_URL = "mapbox://styles/mapbox/dark-v11";

export class MapboxCore {
  private _map: MapboxMap | null = null;
  private _geolocationControl: GeolocateControl | null = null;
  private _initPromise: Promise<void> | null = null;
  private _resolveInit: (() => void) | null = null;
  private _hasCustomViewport = false;

  get map(): MapboxMap | null {
    return this._map;
  }

  get initPromise(): Promise<void> | null {
    return this._initPromise;
  }

  get hasCustomViewport(): boolean {
    return this._hasCustomViewport;
  }

  set hasCustomViewport(value: boolean) {
    this._hasCustomViewport = value;
  }

  isInitialized(): boolean {
    return !!this._map && (this._map.isStyleLoaded() || false);
  }

  async initialise(
    element: HTMLDivElement,
    options?: { center?: MapPoint; zoom?: number },
  ): Promise<void> {
    if (this._map) {
      this._map.remove();
      this._map = null;
      this._initPromise = null;
      this._resolveInit = null;
      this._hasCustomViewport = false;
    }

    element.innerHTML = "";

    this._hasCustomViewport = Boolean(options?.center);
    this._initPromise = new Promise((resolve) => {
      this._resolveInit = resolve;
    });

    const initialCenter = options?.center || [75.2711, 10.8505];
    this._map = new MapboxMap({
      container: element,
      style: STYLE_URL,
      center: initialCenter,
      zoom: options?.zoom || 12,
    });

    if (this._map.isStyleLoaded()) {
      this._resolveInit?.();
      this._resolveInit = null;
    } else {
      this._map.once("load", () => {
        this._resolveInit?.();
        this._resolveInit = null;
      });
    }

    return this._initPromise;
  }

  async destroy(): Promise<void> {
    this._map?.remove();
    this._map = null;
    this._initPromise = null;
    this._resolveInit = null;
    this._hasCustomViewport = false;
  }

  async setCenter(point: MapPoint): Promise<void> {
    this._hasCustomViewport = true;
    if (this._initPromise) await this._initPromise;
    if (!this._map) return;

    this._map.flyTo({ center: point });
  }

  async fitBounds(points: MapPoint[]): Promise<void> {
    this._hasCustomViewport = true;
    if (this._initPromise) await this._initPromise;
    if (!this._map) return;
    if (points.length === 0) return;

    if (points.length === 1) {
      await this.setCenter(points[0]);
      return;
    }

    const bounds = points.reduce(
      (b, pt) => b.extend(pt),
      new mapboxgl.LngLatBounds(points[0], points[0]),
    );

    this._map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
  }

  /**
   * This method gets the current location from the geoloaction
   * browser api and returns [longitude, latitude] array
   *
   * @returns MapPoint : [longitude, latitude]
   */
  async getCurrentLocation(): Promise<MapPoint> {
    const DEFAULT_FALLBACK: MapPoint = [76.95272651, 8.48706726];

    return new Promise((resolve) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        resolve(DEFAULT_FALLBACK);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          resolve([longitude, latitude]);
        },
        (error) => {
          console.warn(
            "Geolocation positioning failed or timed out, using fallback location:",
            error,
          );
          resolve(DEFAULT_FALLBACK);
        },
        { enableHighAccuracy: true, timeout: 5000 },
      );
    });
  }

  async startLocationTracking(): Promise<void> {
    if (this._initPromise) await this._initPromise;
    if (!this._map) return;

    if (this._geolocationControl) {
      await this.stopLocationTracking();
    }

    const geoControl = new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
      showUserLocation: true,
    });

    this._geolocationControl = geoControl;
    this._map.addControl(this._geolocationControl);

    this._geolocationControl.on("error", (error: unknown) => {
      console.error("GeolocateControl error:", error);
    });

    this._geolocationControl.on("ready", () => {
      if (!this._hasCustomViewport) {
        geoControl.trigger();
      }
    });
  }

  async stopLocationTracking(): Promise<void> {
    if (this._geolocationControl && this._map) {
      try {
        if (this._map.hasControl(this._geolocationControl)) {
          this._map.removeControl(this._geolocationControl);
        }
      } catch (error) {
        console.warn("GeolocateControl removal skipped:", error);
      }
    }
    this._geolocationControl = null;
  }
}
