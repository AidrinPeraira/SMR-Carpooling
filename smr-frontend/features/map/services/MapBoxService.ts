import {
  IMapProviderService,
  RouteDrawOptions,
} from "@/features/map/services/IMapProviderService";
import {
  MapPoint,
  Place,
  Route,
  SearchSuggestion,
} from "@/features/map/types/MapTypes";
import { SearchBoxCore, SearchSession } from "@mapbox/search-js-core";
import mapboxgl, {
  GeolocateControl,
  Map as MapboxMap,
  Marker,
} from "mapbox-gl";

const MAP_BOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
mapboxgl.accessToken = MAP_BOX_API_KEY;

/**
 * This is the implementation of the mapbox-gl library
 * to provide map rendering services across components
 */
export class MapBoxService implements IMapProviderService {
  private _map: MapboxMap | null = null;
  private _styleUrl = "mapbox://styles/mapbox/dark-v11";
  private _geolocationControl: GeolocateControl | null = null;
  private _searchBox: SearchBoxCore;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _searchSession: SearchSession<any, any, any, any>;
  private _markers: Map<string, Marker> = new Map();
  private _activeRoutes: Set<string> = new Set();

  constructor() {
    this._searchBox = new SearchBoxCore({
      accessToken: MAP_BOX_API_KEY,
    });
    this._searchSession = new SearchSession(this._searchBox);
  }

  /**
   * Creates a new map instance and sets the center and zoom, resolving when the map style loads
   *
   * @param element : Reference to html element that renders map
   * @param options : optional config for center and zoom
   */
  async initialise(
    element: HTMLDivElement,
    options?: {
      center?: MapPoint;
      zoom?: number;
    },
  ): Promise<void> {
    if (this._map) {
      this.destroy();
    }

    const currentLocation = await this.getCurrentLocation();
    this._map = new MapboxMap({
      container: element,
      style: this._styleUrl,
      center: currentLocation || [75.2711, 10.8505],
      zoom: options?.zoom || 12,
    });
  }

  /**
   * This function clears the map instance
   */
  async destroy(): Promise<void> {
    // remove any location tracking first
    await this.stopLocationTracking();
    await this.clearAllMarkers();
    await this.clearAllRoutes();

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
        { enableHighAccuracy: true, timeout: 20000 },
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

    // Always stop and clean up any existing geolocation control attached to an old map
    if (this._geolocationControl) {
      await this.stopLocationTracking();
    }

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

    this._geolocationControl.on("error", (error: unknown) => {
      console.error("GeolocateControl error:", error);
    });

    this._geolocationControl.on("ready", () => {
      geoControl.trigger();
    });
  }

  /**
   * This method clears any active location tracking listeners
   */
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

  /**
   * This method takes the search string and calls the Mapbox Search Box API
   * and maps the result of suggested places into SearchSuggestion objects
   *
   * @param place : Place name or query as string
   * @returns Array of search suggestions
   */
  async searchSuggestions(place: string): Promise<SearchSuggestion[]> {
    const response = await this._searchSession.suggest(place);

    const result: SearchSuggestion[] = response.suggestions.map(
      (suggestion: Record<string, string>) => {
        return {
          id: suggestion.mapbox_id,
          title: suggestion.name,
          address:
            suggestion.full_address ||
            suggestion.place_formatted ||
            suggestion.name,
        };
      },
    );

    return result;
  }

  /**
   * Retrieves full details including coordinates for a given search suggestion
   *
   * @param suggestion : SearchSuggestion object
   * @returns Full Place object containing lat & lng
   */
  async getPlaceDetails(suggestion: SearchSuggestion): Promise<Place> {
    if (suggestion.point) {
      const [lng, lat] = suggestion.point;
      return {
        id: suggestion.id,
        title: suggestion.title,
        address: suggestion.address,
        lat,
        lng,
      };
    }

    const response = await this._searchSession.retrieve({
      mapbox_id: suggestion.id,
      name: suggestion.title,
      full_address: suggestion.address,
    } as Parameters<typeof this._searchSession.retrieve>[0]);

    const feature = response.features?.[0];
    if (!feature) {
      throw new Error(
        `Failed to retrieve details for place: ${suggestion.title}`,
      );
    }

    const [lng, lat] = feature.geometry.coordinates;
    return {
      id: suggestion.id,
      title: suggestion.title,
      address: suggestion.address,
      lat,
      lng,
    };
  }

  /**
   * This method takes the cordinates for a place and renders a marker at the given coordinates
   * It also adds markers to meomory to keep track of them.
   *
   * @param point : [lng, lat]
   */
  async addMarker(point: MapPoint): Promise<void> {
    if (!this._map) throw new Error("Map not initailised");

    //create a key to identify the marker at each point
    const markerKey = `${point[0]},${point[1]}`;

    if (this._markers.has(markerKey)) return;

    const marker = new Marker();
    marker.setLngLat(point).addTo(this._map);

    this._markers.set(markerKey, marker);
  }

  /**
   * This checks for a marker for a given point. If found it removes it
   *
   * @param point : [lng, lat]
   */
  async removeMarker(point: MapPoint): Promise<void> {
    if (!this._map) throw new Error("Map not initialised");

    const markerKey = `${point[0]},${point[1]}`;

    if (!this._markers.has(markerKey)) return;

    const marker = this._markers.get(markerKey);
    marker?.remove();

    this._markers.delete(markerKey);
  }

  /**
   * This clears all markers set in the current instance
   */
  async clearAllMarkers(): Promise<void> {
    if (this._markers.size > 0) {
      this._markers.forEach((marker) => {
        marker.remove();
      });
      this._markers.clear();
    }
  }

  /**
   * Fits map viewport bounds to contain all given points
   *
   * @param points : Array of MapPoint ([lng, lat])
   */
  async fitBounds(points: MapPoint[]): Promise<void> {
    if (!this._map) throw new Error("Map not initialised");
    if (points.length === 0) return;

    if (points.length === 1) {
      await this.setCenter(points[0]);
      return;
    }

    //we use reduce with bounds object as accumulatot
    const bounds = points.reduce(
      (b, pt) => b.extend(pt),
      new mapboxgl.LngLatBounds(points[0], points[0]),
    );

    this._map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
  }

  /**
   * Fetches direction and route data between waypoints using Mapbox Directions API
   *
   * @param waypoints : Array of MapPoint ([lng, lat])
   * @returns Route object containing origin, destination, distance, duration, and line coordinates
   */
  async getRoute(waypoints: MapPoint[]): Promise<Route> {
    if (waypoints.length < 2) {
      throw new Error(
        "At least origin and destination points are required to get a route",
      );
    }

    const coords = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(";");
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${MAP_BOX_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch route: ${response.statusText}`);
    }

    const data = await response.json();
    const routeData = data.routes?.[0];

    if (!routeData) {
      throw new Error("No route found between specified points");
    }

    return {
      origin: waypoints[0],
      destination: waypoints[waypoints.length - 1],
      totalLengthKm: Number((routeData.distance / 1000).toFixed(2)),
      totalTimeMin: Math.round(routeData.duration / 60),
      route: routeData.geometry.coordinates as MapPoint[],
    };
  }

  /**
   * Draws a GeoJSON line route on the map given an array of coordinates
   *
   * @param points Array of MapPoint ([lng, lat])
   * @param options Optional route drawing styling and custom ID
   */
  async drawRoute(
    points: MapPoint[],
    options?: RouteDrawOptions,
  ): Promise<void> {
    if (!this._map) throw new Error("Map not initialised");

    const routeId = options?.id || "default";
    const routeSourceId = `mapbox-trip-route-source-${routeId}`;
    const routeLayerId = `mapbox-trip-route-layer-${routeId}`;

    this._activeRoutes.add(routeId);

    const feature = {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: points,
      },
    };

    const existingSource = this._map.getSource(
      routeSourceId,
    ) as mapboxgl.GeoJSONSource;

    if (existingSource) {
      existingSource.setData(feature);
    } else {
      this._map.addSource(routeSourceId, {
        type: "geojson",
        data: feature,
      });

      this._map.addLayer({
        id: routeLayerId,
        type: "line",
        source: routeSourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": options?.color || "#3b82f6",
          "line-width": options?.width || 5,
          "line-opacity": options?.opacity || 0.85,
        },
      });
    }
  }

  /**
   * Removes active route layer and source from the map instance for a given ID.
   * If no ID is provided, removes all active routes.
   *
   * @param id Optional route ID to remove
   */
  async removeRoute(id?: string): Promise<void> {
    if (!this._map) return;

    if (!id) {
      await this.clearAllRoutes();
      return;
    }

    const routeSourceId = `mapbox-trip-route-source-${id}`;
    const routeLayerId = `mapbox-trip-route-layer-${id}`;

    if (this._map.getLayer(routeLayerId)) {
      this._map.removeLayer(routeLayerId);
    }
    if (this._map.getSource(routeSourceId)) {
      this._map.removeSource(routeSourceId);
    }

    this._activeRoutes.delete(id);

    // Backward compatibility for legacy single-route IDs
    if (this._map.getLayer("mapbox-trip-route-layer")) {
      this._map.removeLayer("mapbox-trip-route-layer");
    }
    if (this._map.getSource("mapbox-trip-route-source")) {
      this._map.removeSource("mapbox-trip-route-source");
    }
  }

  /**
   * Removes all active route layers and sources from the map instance
   */
  async clearAllRoutes(): Promise<void> {
    if (!this._map) return;

    for (const routeId of this._activeRoutes) {
      const routeSourceId = `mapbox-trip-route-source-${routeId}`;
      const routeLayerId = `mapbox-trip-route-layer-${routeId}`;

      if (this._map.getLayer(routeLayerId)) {
        this._map.removeLayer(routeLayerId);
      }
      if (this._map.getSource(routeSourceId)) {
        this._map.removeSource(routeSourceId);
      }
    }

    this._activeRoutes.clear();

    // Clean up legacy single route IDs if present
    if (this._map.getLayer("mapbox-trip-route-layer")) {
      this._map.removeLayer("mapbox-trip-route-layer");
    }
    if (this._map.getSource("mapbox-trip-route-source")) {
      this._map.removeSource("mapbox-trip-route-source");
    }
  }

  /**
   * Renders a route line on the map using an array of latitude/longitude objects or coordinate tuples
   *
   * @param coordinates Array of { lat, lng } objects or [number, number] tuples
   * @param options Optional route drawing styling and ID
   */
  async drawRouteFromCoordinates(
    coordinates: { lat: number; lng: number }[] | [number, number][],
    options?: RouteDrawOptions,
  ): Promise<void> {
    if (!coordinates || coordinates.length === 0) return;

    const points: MapPoint[] = coordinates.map((coord) => {
      if (Array.isArray(coord)) {
        return [coord[0], coord[1]];
      }
      return [coord.lng, coord.lat];
    });

    await this.drawRoute(points, options);
  }
}

