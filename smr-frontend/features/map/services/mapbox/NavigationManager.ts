import { MapboxCore } from "@/features/map/services/mapbox/MapboxCore";
import { MarkerManager } from "@/features/map/services/mapbox/MarkerManager";
import { RouteManager } from "@/features/map/services/mapbox/RouteManager";
import { MapPoint } from "@/features/map/types/MapTypes";

export class NavigationManager {
  private _core: MapboxCore;
  private _markers: MarkerManager;
  private _routes: RouteManager;
  private _watchId: number | null = null;
  private _lastPosition: MapPoint | null = null;
  private _isFollowing: boolean = true;
  private _pitch: number = 70;
  private _zoom: number = 18;

  private _onLocationUpdate?: (newLocation: MapPoint) => Promise<void>;

  constructor(core: MapboxCore, markers: MarkerManager, routes: RouteManager) {
    this._core = core;
    this._markers = markers;
    this._routes = routes;
  }

  async startNavigation(
    waypoints: MapPoint[],
    handleLocationUpdate?: (newLocation: MapPoint) => Promise<void>,
  ) {
    if (this._core.initPromise) await this._core.initPromise;
    if (!this._core.map) return;

    this._core.hasCustomViewport = true;

    const currentLocation = await this._core.getCurrentLocation();

    this._markers.addNavigationMarker(currentLocation);
    const route = await this._routes.getRoute(waypoints);
    await this._routes.drawRoute(route.route);

    console.log("Here is the route for navigation override: ", route);
    this._isFollowing = true;
    this._onLocationUpdate = handleLocationUpdate;
    this._core.map.on("dragstart", this._onUserInteraction);
    await this.followLocation();

    this._core.map.flyTo({
      center: currentLocation,
      pitch: this._pitch,
      zoom: this._zoom,
    });
  }

  recenterNavigation() {
    if (!this._core.map || !this._lastPosition) return;

    this._isFollowing = true;
    this._core.map.flyTo({
      center: this._lastPosition,
      pitch: this._pitch,
      zoom: this._zoom,
    });
  }

  stopNavigation() {
    if (this._watchId != null) {
      navigator.geolocation.clearWatch(this._watchId);
      this._watchId = null;
    }
    this._core.map?.off("dragstart", this._onUserInteraction);
    this._isFollowing = true;
    this._markers.removeNavigationMarker();
    this._core.hasCustomViewport = false;
  }

  private async followLocation() {
    if (!this._core.map) return;

    this._watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude, heading } = position.coords;
        const point: MapPoint = [longitude, latitude];

        this._markers.updateNavigationMarkerPosition(point);

        const bearing =
          heading ??
          (this._lastPosition
            ? this.computeBearing(this._lastPosition, point)
            : null);
        this._lastPosition = point;

        this._onLocationUpdate?.(this._lastPosition);

        if (this._isFollowing) {
          this._core.map?.easeTo({
            center: point,
            bearing: bearing ?? this._core.map?.getBearing(),
            duration: 1000,
            pitch: this._pitch,
            zoom: this._zoom,
          });
        }
      },
      (error) => console.warn("Watch position error:", error),
      { enableHighAccuracy: true },
    );
  }

  private _onUserInteraction = () => {
    this._isFollowing = false;
  };

  private computeBearing(from: MapPoint, to: MapPoint): number {
    const [lng1, lat1] = from.map((d) => (d * Math.PI) / 180);
    const [lng2, lat2] = to.map((d) => (d * Math.PI) / 180);
    const dLng = lng2 - lng1;
    const x = Math.sin(dLng) * Math.cos(lat2);
    const y =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    return ((Math.atan2(x, y) * 180) / Math.PI + 360) % 360;
  }
}
