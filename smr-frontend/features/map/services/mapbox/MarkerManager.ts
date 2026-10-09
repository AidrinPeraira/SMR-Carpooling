import { MapPoint } from "@/features/map/types/MapTypes";
import { Marker } from "mapbox-gl";
import { MapboxCore } from "./MapboxCore";

export class MarkerManager {
  private _markers: Map<string, Marker> = new Map();
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
}
