import { MapboxCore } from "@/features/map/services/mapbox/MapboxCore";
import { MarkerManager } from "@/features/map/services/mapbox/MarkerManager";
import { RouteManager } from "@/features/map/services/mapbox/RouteManager";
import {
  MapPoint,
  NavigationRoute,
  NavigationState,
} from "@/features/map/types/MapTypes";
import * as turf from "@turf/turf";

const REROUTE_THRESHOLD_METERS = 50;
const REROUTE_COOLDOWN_MS = 5000;

export class NavigationManager {
  private _core: MapboxCore;
  private _markers: MarkerManager;
  private _routes: RouteManager;
  private _watchId: number | null = null;
  private _lastPosition: MapPoint | null = null;
  private _isFollowing: boolean = true;
  private _pitch: number = 70;
  private _zoom: number = 18;

  private _segments: MapPoint[] = [];
  private _currentSegmentIndex: number = 0;
  private _currentRoute: NavigationRoute | null = null;
  private _currentStepIndex: number = 0;
  private _lastRerouteTime: number = 0;

  private _onLocationUpdate?: (newLocation: MapPoint) => Promise<void>;
  private _onNavigationStateChange?: (state: NavigationState) => void;

  constructor(core: MapboxCore, markers: MarkerManager, routes: RouteManager) {
    this._core = core;
    this._markers = markers;
    this._routes = routes;
  }

  async startNavigation(
    waypoints: MapPoint[],
    handleLocationUpdate?: (newLocation: MapPoint) => Promise<void>,
    onNavigationStateChange?: (state: NavigationState) => void,
  ) {
    if (this._core.initPromise) await this._core.initPromise;
    if (!this._core.map) return;

    this._core.hasCustomViewport = true;
    this._onLocationUpdate = handleLocationUpdate;
    this._onNavigationStateChange = onNavigationStateChange;

    this._segments = waypoints;
    this._currentSegmentIndex = 0;

    await this._navigateCurrentSegment();

    this._isFollowing = true;
    this._core.map.on("dragstart", this._onUserInteraction);
    await this._startWatching();

    const currentLocation = await this._core.getCurrentLocation();
    this._core.map.flyTo({
      center: currentLocation,
      pitch: this._pitch,
      zoom: this._zoom,
    });
  }

  async advanceToNextSegment(): Promise<void> {
    if (!this.hasNextSegment()) return;

    this._currentSegmentIndex++;
    await this._routes.clearAll();
    await this._navigateCurrentSegment();
  }

  hasNextSegment(): boolean {
    return this._currentSegmentIndex < this._segments.length - 2;
  }

  getCurrentSegmentIndex(): number {
    return this._currentSegmentIndex;
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
    this._currentRoute = null;
    this._segments = [];
    this._currentSegmentIndex = 0;
  }

  private async _navigateCurrentSegment() {
    const from = this._segments[this._currentSegmentIndex];
    const to = this._segments[this._currentSegmentIndex + 1];
    if (!from || !to) return;

    const currentLocation = await this._core.getCurrentLocation();
    this._markers.addNavigationMarker(currentLocation);

    const route = await this._routes.getNavigationRoute([currentLocation, to]);

    //we need this to mock travelling. levave this log here
    console.log("Current Route: ", route);

    this._currentRoute = route;
    await this._routes.drawRoute(route.route);

    this._currentStepIndex = 0;
    this._emitState();
  }

  private async _reroute(currentPosition: MapPoint) {
    const now = Date.now();
    if (now - this._lastRerouteTime < REROUTE_COOLDOWN_MS) return;
    this._lastRerouteTime = now;

    const to = this._segments[this._currentSegmentIndex + 1];
    if (!to) return;

    await this._routes.clearAll();
    const route = await this._routes.getNavigationRoute([currentPosition, to]);
    this._currentRoute = route;

    //leave this log here. This is to help override location for simulation
    console.log("The new route is: ", route);

    await this._routes.drawRoute(route.route);

    this._currentStepIndex = 0;
    this._emitState();
  }

  private _updateStepTracking(currentPosition: MapPoint) {
    if (!this._currentRoute || this._currentRoute.steps.length === 0) return;

    const currentPoint = turf.point(currentPosition);
    const steps = this._currentRoute.steps;

    let closestStepIdx = this._currentStepIndex;
    let minDist = Infinity;

    const searchStart = Math.max(0, this._currentStepIndex - 1);
    const searchEnd = Math.min(steps.length - 1, this._currentStepIndex + 3);

    for (let i = searchStart; i <= searchEnd; i++) {
      const stepLocation = turf.point(steps[i].maneuver.location);
      const dist = turf.distance(currentPoint, stepLocation, {
        units: "meters",
      });
      if (dist < minDist) {
        minDist = dist;
        closestStepIdx = i;
      }
    }

    if (closestStepIdx > this._currentStepIndex) {
      this._currentStepIndex = closestStepIdx;
    }

    this._emitState();
  }

  private _checkDeviation(currentPosition: MapPoint): boolean {
    if (!this._currentRoute || this._currentRoute.route.length < 2)
      return false;

    const line = turf.lineString(this._currentRoute.route);
    const point = turf.point(currentPosition);
    const snapped = turf.nearestPointOnLine(line, point, { units: "meters" });
    const deviation = snapped.properties.dist ?? 0;

    return deviation > REROUTE_THRESHOLD_METERS;
  }

  private _emitState() {
    if (!this._onNavigationStateChange) return;

    const steps = this._currentRoute?.steps ?? [];
    const currentStep = steps[this._currentStepIndex] ?? null;

    let distanceToNextManeuver = 0;
    if (
      currentStep &&
      this._lastPosition &&
      this._currentStepIndex + 1 < steps.length
    ) {
      const nextManeuver = steps[this._currentStepIndex + 1];
      distanceToNextManeuver = turf.distance(
        turf.point(this._lastPosition),
        turf.point(nextManeuver.maneuver.location),
        { units: "meters" },
      );
    } else if (currentStep && this._lastPosition) {
      distanceToNextManeuver = turf.distance(
        turf.point(this._lastPosition),
        turf.point(currentStep.maneuver.location),
        { units: "meters" },
      );
    }

    this._onNavigationStateChange({
      currentSegmentIndex: this._currentSegmentIndex,
      totalSegments: Math.max(0, this._segments.length - 1),
      currentStep,
      distanceToNextManeuver: Math.round(distanceToNextManeuver),
      currentRoute: this._currentRoute,
    });
  }

  private async _startWatching() {
    if (!this._core.map) return;

    this._watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude, heading } = position.coords;
        const point: MapPoint = [longitude, latitude];

        this._markers.updateNavigationMarkerPosition(point);

        const bearing =
          heading ??
          (this._lastPosition
            ? this._computeBearing(this._lastPosition, point)
            : null);
        this._lastPosition = point;

        this._onLocationUpdate?.(this._lastPosition);

        this._updateStepTracking(point);

        if (this._checkDeviation(point)) {
          this._reroute(point);
        }

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

  private _computeBearing(from: MapPoint, to: MapPoint): number {
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
