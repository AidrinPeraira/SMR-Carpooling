import { MapPoint } from "@/features/map/types/MapTypes";
import { Marker } from "mapbox-gl";
import { MapboxCore } from "./MapboxCore";

export class MarkerManager {
  private _markers: Map<string, Marker> = new Map();
  private _navigationMarker: Marker | null = null;
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
