# Granular Manual Setup Guide: Trip Creation, Mapbox Routing & API Integration

This guide provides step-by-step instructions and complete code snippets so you can manually build and wire up place search, route selection, map rendering, and trip creation API integration.

---

## Prerequisites & Dependencies
- Package `@sharemyride/shared` installed in `smr-frontend`.
- Mapbox Access Token set in environment: `NEXT_PUBLIC_MAPBOX_TOKEN`.
- Backend URL set in environment: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000`).

---

## Step 1: Update Map Types
**File**: `smr-frontend/features/map/types/MapTypes.ts`

Add the `RouteOption` type definition to represent parsed route options returned by Mapbox.

```typescript
export type MapPoint = [number, number];

export type Waypoint = {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
};

export type RouteOption = {
  id: string;
  summary: string;
  distanceKm: number;
  durationMinutes: number;
  coordinates: MapPoint[];
};
```

---

## Step 2: Extend `IMapProviderService`
**File**: `smr-frontend/features/map/services/IMapProviderService.ts`

Declare the three new methods for location search, fetching route options, and rendering map layers.

```typescript
"use client";
import { MapPoint, RouteOption } from "@/features/map/types/MapTypes";
import { TripStopSchemaType } from "@sharemyride/shared";

export interface IMapProviderService {
  initialise(
    element: HTMLDivElement,
    options?: {
      center?: MapPoint;
      zoom?: number;
    },
  ): void;

  destroy(): void;

  setCenter(point: MapPoint): void;

  getCurrentLocation(): Promise<MapPoint>;

  centerOnUserLocation(): Promise<void>;

  // Search & Routing Methods
  searchPlaces(query: string): Promise<TripStopSchemaType[]>;

  fetchRoutes(waypoints: TripStopSchemaType[]): Promise<RouteOption[]>;

  renderRoutesAndMarkers(
    waypoints: TripStopSchemaType[],
    routes: RouteOption[],
    selectedIndex: number,
  ): void;
}
```

---

## Step 3: Implement Methods in `MapBoxService`
**File**: `smr-frontend/features/map/services/MapBoxService.ts`

Implement `searchPlaces`, `fetchRoutes`, and `renderRoutesAndMarkers` inside `MapBoxService`.

```typescript
import { IMapProviderService } from "@/features/map/services/IMapProviderService";
import { MapPoint, RouteOption } from "@/features/map/types/MapTypes";
import { TripStopSchemaType } from "@sharemyride/shared";
import mapboxgl, { Map, Marker, LngLatBounds } from "mapbox-gl";

const MAP_BOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
mapboxgl.accessToken = MAP_BOX_API_KEY;

export class MapBoxService implements IMapProviderService {
  private _map: Map | null = null;
  private _styleUrl = "mapbox://styles/mapbox/dark-v11";
  private _markers: Marker[] = [];
  private _routeSourceIds: string[] = [];

  initialise(
    element: HTMLDivElement,
    options?: {
      center?: MapPoint;
      zoom?: number;
    },
  ) {
    this._map = new Map({
      container: element,
      style: this._styleUrl,
      center: options?.center || [75.2711, 10.8505],
      zoom: options?.zoom || 12,
    });
  }

  destroy(): void {
    this.clearMapLayers();
    this._map?.remove();
    this._map = null;
  }

  setCenter(point: MapPoint): void {
    if (!this._map) throw Error("No map initialised");
    this._map.flyTo({ center: point });
  }

  getCurrentLocation(): Promise<MapPoint> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve([pos.coords.longitude, pos.coords.latitude]),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  }

  async centerOnUserLocation(): Promise<void> {
    try {
      const coords = await this.getCurrentLocation();
      this.setCenter(coords);
    } catch (err) {
      console.warn("Could not retrieve user location", err);
    }
  }

  // --- Step 3.1: Search Places via Geocoding API ---
  async searchPlaces(query: string): Promise<TripStopSchemaType[]> {
    if (!query.trim()) return [];
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAP_BOX_API_KEY}&autocomplete=true&limit=5`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();

    return (data.features || []).map((feature: any) => ({
      stop_name: feature.text || feature.place_name.split(",")[0],
      stop_address: feature.place_name,
      stop_lng: feature.center[0],
      stop_lat: feature.center[1],
    }));
  }

  // --- Step 3.2: Fetch Routes via Directions API ---
  async fetchRoutes(waypoints: TripStopSchemaType[]): Promise<RouteOption[]> {
    if (waypoints.length < 2) return [];

    const coordString = waypoints.map((w) => `${w.stop_lng},${w.stop_lat}`).join(";");
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?alternatives=true&geometries=geojson&overview=full&access_token=${MAP_BOX_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();

    return (data.routes || []).map((r: any, idx: number) => ({
      id: `route-${idx}`,
      summary: r.legs?.[0]?.summary ? `via ${r.legs[0].summary}` : `Route ${idx + 1}`,
      distanceKm: Math.round((r.distance / 1000) * 10) / 10,
      durationMinutes: Math.round(r.duration / 60),
      coordinates: r.geometry.coordinates as MapPoint[],
    }));
  }

  // --- Step 3.3: Render Markers & Routes on Map ---
  renderRoutesAndMarkers(
    waypoints: TripStopSchemaType[],
    routes: RouteOption[],
    selectedIndex: number,
  ): void {
    if (!this._map) return;

    this.clearMapLayers();

    const bounds = new LngLatBounds();

    // 1. Add Markers for Waypoints
    waypoints.forEach((w, idx) => {
      bounds.extend([w.stop_lng, w.stop_lat]);
      const color = idx === 0 ? "#006c45" : idx === waypoints.length - 1 ? "#ba1a1a" : "#4f6357";
      const el = document.createElement("div");
      el.className = "w-4 h-4 rounded-full border-2 border-white shadow-md";
      el.style.backgroundColor = color;

      const marker = new Marker({ element: el })
        .setLngLat([w.stop_lng, w.stop_lat])
        .addTo(this._map!);
      this._markers.push(marker);
    });

    // 2. Render Unselected Alternative Routes (Background Line)
    routes.forEach((route, idx) => {
      if (idx === selectedIndex) return;
      this.drawRouteLine(`route-alt-${idx}`, route.coordinates, "#8A9A90", 0.4, 4);
    });

    // 3. Render Active Selected Route (Foreground Line)
    if (routes[selectedIndex]) {
      const activeRoute = routes[selectedIndex];
      activeRoute.coordinates.forEach((pt) => bounds.extend(pt));
      this.drawRouteLine(`route-active`, activeRoute.coordinates, "#006c45", 0.9, 6);
    }

    // 4. Adjust Map Viewport Bounds
    if (!bounds.isEmpty()) {
      this._map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
  }

  private drawRouteLine(
    id: string,
    coordinates: MapPoint[],
    color: string,
    opacity: number,
    width: number,
  ) {
    if (!this._map) return;
    const sourceId = `src-${id}`;
    const layerId = `layer-${id}`;

    this._map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: coordinates,
        },
      },
    });

    this._map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": color,
        "line-opacity": opacity,
        "line-width": width,
      },
    });

    this._routeSourceIds.push(sourceId);
  }

  private clearMapLayers() {
    this._markers.forEach((m) => m.remove());
    this._markers = [];

    if (this._map) {
      this._routeSourceIds.forEach((sId) => {
        const lId = sId.replace("src-", "layer-");
        if (this._map?.getLayer(lId)) this._map.removeLayer(lId);
        if (this._map?.getSource(sId)) this._map.removeSource(sId);
      });
    }
    this._routeSourceIds = [];
  }
}
```

---

## Step 4: Create Trip API Service
**File**: `smr-frontend/features/driver/trips/api/tripApi.ts`

Create the backend API helper function to post trip data.

```typescript
import { CreateTripSchemaType } from "@sharemyride/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function createTripApi(payload: CreateTripSchemaType): Promise<any> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  const response = await fetch(`${API_BASE_URL}/api/v1/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-frontend-key": process.env.NEXT_PUBLIC_FRONTEND_KEY || "",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to create trip" }));
    throw new Error(error.message || "Failed to create trip");
  }

  return response.json();
}
```

---

## Step 5: Wire Up `CreateTripForm.tsx`
**File**: `smr-frontend/features/driver/trips/forms/CreateTripForm.tsx`

Update `CreateTripForm` to handle place searching, dynamic stops, route fetching/selection, and API submission.

```tsx
"use client";

import { useState, useEffect } from "react";
import { useMap } from "@/features/map/hooks/useMap";
import { RouteOption } from "@/features/map/types/MapTypes";
import { TripStopSchemaType, CreateTripSchemaType } from "@sharemyride/shared";
import { createTripApi } from "@/features/driver/trips/api/tripApi";
import { Button, Card, CardBody, CardHeader, DropDown, Input, Label } from "@sharemyride/ui";
import { Plus, Trash2 } from "lucide-react";

export function CreateTripForm() {
  const mapService = useMap();

  // Route Points State
  const [origin, setOrigin] = useState<TripStopSchemaType | null>(null);
  const [originQuery, setOriginQuery] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState<TripStopSchemaType[]>([]);

  const [destination, setDestination] = useState<TripStopSchemaType | null>(null);
  const [destinationQuery, setDestinationQuery] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState<TripStopSchemaType[]>([]);

  const [stops, setStops] = useState<(TripStopSchemaType | null)[]>([]);
  const [stopQueries, setStopQueries] = useState<string[]>([]);
  const [stopSuggestionsList, setStopSuggestionsList] = useState<TripStopSchemaType[][]>([]);

  // Routes & Form Detail State
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [vehicleId, setVehicleId] = useState("vh_12345");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [availableSeats, setAvailableSeats] = useState(3);
  const [selectedTags, setSelectedTags] = useState<string[]>(["AC", "Non-smoking"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Search Place Handlers ---
  const handleSearchOrigin = async (query: string) => {
    setOriginQuery(query);
    if (query.length > 2) {
      const results = await mapService.searchPlaces(query);
      setOriginSuggestions(results);
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleSearchDestination = async (query: string) => {
    setDestinationQuery(query);
    if (query.length > 2) {
      const results = await mapService.searchPlaces(query);
      setDestinationSuggestions(results);
    } else {
      setDestinationSuggestions([]);
    }
  };

  // --- Route Calculation Trigger ---
  useEffect(() => {
    async function updateRoutes() {
      const validStops = stops.filter((s): s is TripStopSchemaType => s !== null);
      if (origin && destination) {
        const waypoints = [origin, ...validStops, destination];
        const fetchedRoutes = await mapService.fetchRoutes(waypoints);
        setRoutes(fetchedRoutes);
        setSelectedRouteIndex(0);

        if (fetchedRoutes.length > 0) {
          mapService.renderRoutesAndMarkers(waypoints, fetchedRoutes, 0);
        }
      }
    }
    updateRoutes();
  }, [origin, destination, stops, mapService]);

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || routes.length === 0) {
      alert("Please select origin, destination, and a valid route.");
      return;
    }

    const activeRoute = routes[selectedRouteIndex];
    const validStops = stops.filter((s): s is TripStopSchemaType => s !== null);

    const payload: CreateTripSchemaType = {
      vehicle_id: vehicleId,
      trip_origin: origin,
      trip_destination: destination,
      trip_stops: [origin, ...validStops, destination],
      trip_route: activeRoute.coordinates,
      trip_distance: activeRoute.distanceKm,
      available_seats: Number(availableSeats),
      total_seats: Number(availableSeats),
      trip_tags: selectedTags,
      start_time: new Date(`${departureDate}T${departureTime}`),
    };

    try {
      setIsSubmitting(true);
      await createTripApi(payload);
      alert("Trip created successfully!");
    } catch (err: any) {
      alert(err.message || "Error creating trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-lg font-bold text-content-primary">Create a Trip</h2>
        <p className="text-xs text-content-secondary">Offer a ride to passengers along your route.</p>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Origin Search */}
          <div className="relative">
            <Label className="mb-1">Origin</Label>
            <Input
              value={originQuery}
              onChange={(e) => handleSearchOrigin(e.target.value)}
              placeholder="Search starting location..."
            />
            {originSuggestions.length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-surface-card border border-border-strong rounded-sm shadow-lg max-h-40 overflow-y-auto">
                {originSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setOrigin(item);
                      setOriginQuery(item.stop_address);
                      setOriginSuggestions([]);
                    }}
                    className="p-2 text-xs hover:bg-surface-muted cursor-pointer text-content-primary truncate"
                  >
                    {item.stop_address}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Stops */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Intermediate Stops (Optional)</Label>
              <button
                type="button"
                onClick={() => {
                  setStops([...stops, null]);
                  setStopQueries([...stopQueries, ""]);
                  setStopSuggestionsList([...stopSuggestionsList, []]);
                }}
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stop
              </button>
            </div>
            {stops.map((_, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={stopQueries[idx] || ""}
                  onChange={async (e) => {
                    const q = e.target.value;
                    const newQueries = [...stopQueries];
                    newQueries[idx] = q;
                    setStopQueries(newQueries);

                    if (q.length > 2) {
                      const res = await mapService.searchPlaces(q);
                      const newSugg = [...stopSuggestionsList];
                      newSugg[idx] = res;
                      setStopSuggestionsList(newSugg);
                    }
                  }}
                  placeholder={`Stop ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setStops(stops.filter((_, i) => i !== idx));
                    setStopQueries(stopQueries.filter((_, i) => i !== idx));
                    setStopSuggestionsList(stopSuggestionsList.filter((_, i) => i !== idx));
                  }}
                  className="text-content-secondary hover:text-fg-danger p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Destination Search */}
          <div className="relative">
            <Label className="mb-1">Destination</Label>
            <Input
              value={destinationQuery}
              onChange={(e) => handleSearchDestination(e.target.value)}
              placeholder="Search destination location..."
            />
            {destinationSuggestions.length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-surface-card border border-border-strong rounded-sm shadow-lg max-h-40 overflow-y-auto">
                {destinationSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setDestination(item);
                      setDestinationQuery(item.stop_address);
                      setDestinationSuggestions([]);
                    }}
                    className="p-2 text-xs hover:bg-surface-muted cursor-pointer text-content-primary truncate"
                  >
                    {item.stop_address}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Route Options Selection */}
          {routes.length > 0 && (
            <div>
              <Label className="mb-2">Select Route</Label>
              <div className="flex flex-col gap-2">
                {routes.map((route, idx) => (
                  <label
                    key={route.id}
                    onClick={() => {
                      setSelectedRouteIndex(idx);
                      const validStops = stops.filter((s): s is TripStopSchemaType => s !== null);
                      if (origin && destination) {
                        mapService.renderRoutesAndMarkers([origin, ...validStops, destination], routes, idx);
                      }
                    }}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedRouteIndex === idx
                        ? "border-accent bg-accent/10 shadow-sm font-semibold"
                        : "border-border-strong bg-surface-base"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" name="route_select" checked={selectedRouteIndex === idx} onChange={() => {}} />
                      <div>
                        <div className="text-xs font-bold text-content-primary">{route.summary}</div>
                        <div className="text-[11px] text-content-secondary">
                          {route.durationMinutes} mins • {route.distanceKm} km
                        </div>
                      </div>
                    </div>
                    {idx === 0 && <span className="text-[10px] bg-accent text-accent-fg px-2 py-0.5 rounded">Fastest</span>}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Departure Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1">Departure Date</Label>
              <Input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1">Departure Time</Label>
              <Input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
            </div>
          </div>

          {/* Seats & Vehicle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1">Available Seats</Label>
              <Input
                type="number"
                min={1}
                max={8}
                value={availableSeats}
                onChange={(e) => setAvailableSeats(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="mb-1">Vehicle</Label>
              <DropDown
                value={vehicleId}
                onChange={(val) => setVehicleId(val)}
                options={[
                  { label: "Tesla Model 3", value: "vh_12345" },
                  { label: "Toyota Prius", value: "vh_67890" },
                ]}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Trip"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
```

---

## Step 6: Verify Layout Integration
**File**: `smr-frontend/features/driver/trips/views/NewTripView.tsx`

Ensure `MapProvider` wraps `NewTripView` so `useMap()` can access `MapBoxService`.

```tsx
import { CreateTripForm } from "@/features/driver/trips/forms/CreateTripForm";
import { MapContainer } from "@/features/map/components/MapContainer";
import { MapProvider } from "@/features/map/context/MapProvider";

export function NewTripView() {
  return (
    <MapProvider>
      <div className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden">
        <div className="absolute inset-0 lg:relative lg:inset-auto flex-1 h-full w-full">
          <MapContainer />
        </div>
        <div className="fixed bottom-0 left-0 right-0 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-border-strong bg-surface-card p-4 shadow-2xl z-20 lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:max-h-full lg:h-full lg:w-full lg:max-w-sm lg:flex-shrink-0 lg:rounded-none lg:border-t-0 lg:border-r lg:shadow-none lg:z-auto lg:p-6 lg:bg-surface-base">
          <CreateTripForm />
        </div>
      </div>
    </MapProvider>
  );
}
```
