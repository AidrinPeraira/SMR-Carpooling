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
import { MapboxCore } from "./mapbox/MapboxCore";
import { MarkerManager } from "./mapbox/MarkerManager";
import { RouteManager } from "./mapbox/RouteManager";
import { SearchProvider } from "./mapbox/SearchProvider";
import { NavigationManager } from "@/features/map/services/mapbox/NavigationManager";

export class MapBoxService implements IMapProviderService {
  private _core = new MapboxCore();
  private _markers = new MarkerManager(this._core);
  private _routes = new RouteManager(this._core);
  private _search = new SearchProvider();
  private _navigation = new NavigationManager(
    this._core,
    this._markers,
    this._routes,
  );

  isInitialized(): boolean {
    return this._core.isInitialized();
  }

  async initialise(
    element: HTMLDivElement,
    options?: { center?: MapPoint; zoom?: number },
  ): Promise<void> {
    await this.destroy();

    const initPromise = this._core.initialise(element, options);

    if (!options?.center) {
      this._core
        .getCurrentLocation()
        .then((location) => {
          if (this._core.map && location && !this._core.hasCustomViewport) {
            this._core.map.setCenter(location);
          }
        })
        .catch(() => {});
    }

    return initPromise;
  }

  async destroy(): Promise<void> {
    await this._core.stopLocationTracking();
    await this._markers.clearAll();
    await this._routes.clearAll();
    await this._core.destroy();
  }

  async setCenter(point: MapPoint): Promise<void> {
    return this._core.setCenter(point);
  }

  async getCurrentLocation(): Promise<MapPoint> {
    return this._core.getCurrentLocation();
  }

  async startLocationTracking(): Promise<void> {
    return this._core.startLocationTracking();
  }

  async stopLocationTracking(): Promise<void> {
    return this._core.stopLocationTracking();
  }

  async searchSuggestions(place: string): Promise<SearchSuggestion[]> {
    return this._search.searchSuggestions(place);
  }

  async getPlaceDetails(suggestion: SearchSuggestion): Promise<Place> {
    return this._search.getPlaceDetails(suggestion);
  }

  async addMarker(point: MapPoint): Promise<void> {
    return this._markers.addMarker(point);
  }

  async addMarkerWithLabel(point: MapPoint, label: string, radiusMeters?: number): Promise<void> {
    return this._markers.addMarkerWithLabel(point, label, radiusMeters);
  }

  async removeMarker(point: MapPoint): Promise<void> {
    return this._markers.removeMarker(point);
  }

  async clearAllMarkers(): Promise<void> {
    return this._markers.clearAll();
  }

  async fitBounds(points: MapPoint[]): Promise<void> {
    return this._core.fitBounds(points);
  }

  async getRoute(waypoints: MapPoint[]): Promise<Route> {
    return this._routes.getRoute(waypoints);
  }

  async drawRoute(
    points: MapPoint[],
    options?: RouteDrawOptions,
  ): Promise<void> {
    return this._routes.drawRoute(points, options);
  }

  async removeRoute(id?: string): Promise<void> {
    return this._routes.removeRoute(id);
  }

  async clearAllRoutes(): Promise<void> {
    return this._routes.clearAll();
  }

  async drawRouteFromCoordinates(
    coordinates: { lat: number; lng: number }[] | [number, number][],
    options?: RouteDrawOptions,
  ): Promise<void> {
    return this._routes.drawRouteFromCoordinates(coordinates, options);
  }

  async startNavigation(
    waypoints: MapPoint[],
    handleLocationUpdate?: (newLocation: MapPoint) => Promise<void>,
  ): Promise<void> {
    return this._navigation.startNavigation(waypoints, handleLocationUpdate);
  }

  async stopNavigation(): Promise<void> {
    return this._navigation.stopNavigation();
  }

  async recenterNavigation(): Promise<void> {
    return this._navigation.recenterNavigation();
  }
}
