import { RouteDrawOptions } from "@/features/map/services/IMapProviderService";
import {
  MapPoint,
  NavigationRoute,
  Route,
  RouteStep,
} from "@/features/map/types/MapTypes";
import { MapboxCore } from "./MapboxCore";

const MAP_BOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export class RouteManager {
  private _activeRoutes: Set<string> = new Set();
  private _core: MapboxCore;

  constructor(core: MapboxCore) {
    this._core = core;
  }

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

  async getNavigationRoute(waypoints: MapPoint[]): Promise<NavigationRoute> {
    if (waypoints.length < 2) {
      throw new Error(
        "At least origin and destination points are required to get a route",
      );
    }

    const coords = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(";");
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&steps=true&banner_instructions=true&access_token=${MAP_BOX_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch route: ${response.statusText}`);
    }

    const data = await response.json();
    const routeData = data.routes?.[0];

    if (!routeData) {
      throw new Error("No route found between specified points");
    }

    const steps: RouteStep[] = routeData.legs.flatMap(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (leg: any) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        leg.steps.map((step: any) => ({
          maneuver: {
            type: step.maneuver.type,
            modifier: step.maneuver.modifier,
            instruction: step.maneuver.instruction,
            location: step.maneuver.location as MapPoint,
          },
          distance: step.distance,
          duration: step.duration,
          name: step.name || "",
        })),
    );

    return {
      origin: waypoints[0],
      destination: waypoints[waypoints.length - 1],
      totalLengthKm: Number((routeData.distance / 1000).toFixed(2)),
      totalTimeMin: Math.round(routeData.duration / 60),
      route: routeData.geometry.coordinates as MapPoint[],
      steps,
    };
  }

  async drawRoute(
    points: MapPoint[],
    options?: RouteDrawOptions,
  ): Promise<void> {
    if (this._core.initPromise) await this._core.initPromise;
    if (!this._core.map) return;

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

    const existingSource = this._core.map.getSource(
      routeSourceId,
    ) as mapboxgl.GeoJSONSource;

    if (existingSource) {
      existingSource.setData(feature);
    } else {
      this._core.map.addSource(routeSourceId, {
        type: "geojson",
        data: feature,
      });

      this._core.map.addLayer({
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

  async removeRoute(id?: string): Promise<void> {
    if (this._core.initPromise) await this._core.initPromise;
    if (!this._core.map) return;

    if (!id) {
      await this.clearAll();
      return;
    }

    const routeSourceId = `mapbox-trip-route-source-${id}`;
    const routeLayerId = `mapbox-trip-route-layer-${id}`;

    if (this._core.map.getLayer(routeLayerId)) {
      this._core.map.removeLayer(routeLayerId);
    }
    if (this._core.map.getSource(routeSourceId)) {
      this._core.map.removeSource(routeSourceId);
    }

    this._activeRoutes.delete(id);

    if (this._core.map.getLayer("mapbox-trip-route-layer")) {
      this._core.map.removeLayer("mapbox-trip-route-layer");
    }
    if (this._core.map.getSource("mapbox-trip-route-source")) {
      this._core.map.removeSource("mapbox-trip-route-source");
    }
  }

  async clearAll(): Promise<void> {
    if (this._core.initPromise) await this._core.initPromise;
    if (!this._core.map) return;

    for (const routeId of this._activeRoutes) {
      const routeSourceId = `mapbox-trip-route-source-${routeId}`;
      const routeLayerId = `mapbox-trip-route-layer-${routeId}`;

      if (this._core.map.getLayer(routeLayerId)) {
        this._core.map.removeLayer(routeLayerId);
      }
      if (this._core.map.getSource(routeSourceId)) {
        this._core.map.removeSource(routeSourceId);
      }
    }

    this._activeRoutes.clear();

    if (this._core.map.getLayer("mapbox-trip-route-layer")) {
      this._core.map.removeLayer("mapbox-trip-route-layer");
    }
    if (this._core.map.getSource("mapbox-trip-route-source")) {
      this._core.map.removeSource("mapbox-trip-route-source");
    }
  }

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
