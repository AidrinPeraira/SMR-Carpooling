import { MapPoint } from "@/features/map/types/MapTypes";
import { Marker } from "mapbox-gl";
import { MapboxCore } from "./MapboxCore";

export class MarkerManager {
  private _markers: Map<string, Marker> = new Map();
  private _radiusLayers: string[] = [];
  private _radiusSources: string[] = [];
  private _navigationMarker: Marker | null = null;
  private _driverMarker: Marker | null = null;
  private _core: MapboxCore;

  constructor(core: MapboxCore) {
    this._core = core;
  }

  async addMarker(point: MapPoint): Promise<void> {
    if (this._core.initPromise) await this._core.initPromise;
    if (!this._core.map) return;

    const markerKey = `${point[0]},${point[1]}`;
    if (this._markers.has(markerKey)) return;

    const marker = new Marker();
    marker.setLngLat(point).addTo(this._core.map);

    this._markers.set(markerKey, marker);
  }

  async addMarkerWithLabel(
    point: MapPoint,
    label: string,
    radiusMeters?: number,
  ): Promise<void> {
    if (this._core.initPromise) await this._core.initPromise;
    if (!this._core.map) return;

    const markerKey = `${point[0]},${point[1]}`;
    if (this._markers.has(markerKey)) return;

    if (radiusMeters) {
      this._addRadiusCircle(point, radiusMeters);
    }

    const el = document.createElement("div");
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.alignItems = "center";

    el.innerHTML = `
      <div style="
        background: white;
        color: #1a1a1a;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        white-space: nowrap;
        margin-bottom: 4px;
        line-height: 1.3;
        text-align: center;
      ">${label}</div>
      <div style="
        width: 12px;
        height: 12px;
        background: #4A90FF;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `;

    const marker = new Marker({ element: el, anchor: "bottom" })
      .setLngLat(point)
      .addTo(this._core.map);

    this._markers.set(markerKey, marker);
  }

  private _addRadiusCircle(point: MapPoint, radiusMeters: number): void {
    if (!this._core.map) return;

    const id = `radius-${point[0]}-${point[1]}`;
    const fillSourceId = `${id}-fill-src`;
    const pulseSourceId = `${id}-pulse-src`;

    const circleCoords = this._createCirclePolygon(point, radiusMeters);

    this._core.map.addSource(fillSourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [circleCoords] },
        properties: {},
      },
    });

    this._core.map.addLayer({
      id: `${id}-fill`,
      type: "fill",
      source: fillSourceId,
      paint: {
        "fill-color": "#4A90FF",
        "fill-opacity": 0.12,
      },
    });

    this._core.map.addLayer({
      id: `${id}-stroke`,
      type: "line",
      source: fillSourceId,
      paint: {
        "line-color": "#4A90FF",
        "line-width": 1.5,
        "line-opacity": 0.4,
      },
    });

    this._core.map.addSource(pulseSourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [circleCoords] },
        properties: {},
      },
    });

    this._core.map.addLayer({
      id: `${id}-pulse`,
      type: "line",
      source: pulseSourceId,
      paint: {
        "line-color": "#4A90FF",
        "line-width": 2,
        "line-opacity": 0.6,
      },
    });

    this._radiusLayers.push(`${id}-fill`, `${id}-stroke`, `${id}-pulse`);
    this._radiusSources.push(fillSourceId, pulseSourceId);

    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!this._core.map) return;
      if (!start) start = timestamp;

      const elapsed = (timestamp - start) % 2000;
      const t = elapsed / 2000;
      const scale = 1 + t * 0.3;
      const opacity = 0.6 * (1 - t);

      try {
        const pulseSource = this._core.map.getSource(pulseSourceId);
        if (pulseSource && "setData" in pulseSource) {
          (pulseSource as mapboxgl.GeoJSONSource).setData({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                this._createCirclePolygon(point, radiusMeters * scale),
              ],
            },
            properties: {},
          });
        }
        this._core.map.setPaintProperty(`${id}-pulse`, "line-opacity", opacity);
      } catch {
        return;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  private _createCirclePolygon(
    center: MapPoint,
    radiusMeters: number,
    steps = 64,
  ): [number, number][] {
    const coords: [number, number][] = [];
    const earthRadius = 6371000;
    const lat = (center[1] * Math.PI) / 180;
    const lng = (center[0] * Math.PI) / 180;

    for (let i = 0; i <= steps; i++) {
      const angle = (i * 2 * Math.PI) / steps;
      const dLat = (radiusMeters / earthRadius) * Math.cos(angle);
      const dLng =
        (radiusMeters / (earthRadius * Math.cos(lat))) * Math.sin(angle);
      coords.push([
        ((lng + dLng) * 180) / Math.PI,
        ((lat + dLat) * 180) / Math.PI,
      ]);
    }

    return coords;
  }

  addDriverMarker(point: MapPoint) {
    if (!this._core.map) return;

    this._driverMarker?.remove();

    const el = document.createElement("div");
    el.innerHTML = `
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <filter id="driver-shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
        <circle cx="18" cy="18" r="14" fill="#10b981" stroke="#ffffff" stroke-width="3" filter="url(#driver-shadow)"/>
        <path d="M12 20v1.5a1 1 0 001 1h1a1 1 0 001-1V20m8 0v1.5a1 1 0 001 1h1a1 1 0 001-1V20m-1-4l-1.5-4.5a2 2 0 00-1.9-1.5h-5.2a2 2 0 00-1.9 1.5L13 16m12 0H12m12 0v3a1 1 0 01-1 1H14a1 1 0 01-1-1v-3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `;
    el.style.cursor = "pointer";

    this._driverMarker = new Marker({ element: el, anchor: "center" })
      .setLngLat(point)
      .addTo(this._core.map);
  }

  updateDriverMarkerPosition(point: MapPoint) {
    this._driverMarker?.setLngLat(point);
  }

  removeDriverMarker() {
    this._driverMarker?.remove();
    this._driverMarker = null;
  }

  async removeMarker(point: MapPoint): Promise<void> {
    if (this._core.initPromise) await this._core.initPromise;
    if (!this._core.map) return;

    const markerKey = `${point[0]},${point[1]}`;
    if (!this._markers.has(markerKey)) return;

    const marker = this._markers.get(markerKey);
    marker?.remove();
    this._markers.delete(markerKey);
  }

  async clearAll(): Promise<void> {
    if (this._core.initPromise) await this._core.initPromise;
    if (this._markers.size > 0) {
      this._markers.forEach((marker) => marker.remove());
      this._markers.clear();
    }

    if (this._core.map) {
      for (const layerId of this._radiusLayers) {
        try {
          this._core.map.removeLayer(layerId);
        } catch {
          /* already removed */
        }
      }
      for (const srcId of this._radiusSources) {
        try {
          this._core.map.removeSource(srcId);
        } catch {
          /* already removed */
        }
      }
    }
    this._radiusLayers = [];
    this._radiusSources = [];
  }

  addNavigationMarker(point: MapPoint) {
    if (!this._core.map) return;

    this._navigationMarker?.remove();

    const el = document.createElement("div");
    el.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <filter id="nav-shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
        <polygon
          points="16,2 28,28 16,22 4,28"
          fill="#4A90FF"
          stroke="#ffffff"
          stroke-width="2"
          stroke-linejoin="round"
          filter="url(#nav-shadow)"
        />
      </svg>
    `;
    el.style.cursor = "pointer";

    this._navigationMarker = new Marker({ element: el, anchor: "center" })
      .setLngLat(point)
      .addTo(this._core.map);
  }

  updateNavigationMarkerPosition(point: MapPoint) {
    this._navigationMarker?.setLngLat(point);
  }

  updateNavigationMarkerRotation(heading: number) {
    const svg = this._navigationMarker?.getElement()?.querySelector("svg");
    if (svg) {
      svg.style.transform = `rotate(${heading}deg)`;
    }
  }

  removeNavigationMarker() {
    this._navigationMarker?.remove();
    this._navigationMarker = null;
  }
}
