"use client";

import { MapSearchInput } from "@/features/map/components/MapSearchInput";
import { useMap } from "@/features/map/hooks/useMap";
import { MapPoint, Place } from "@/features/map/types/MapTypes";
import { Button, Input, Label } from "@sharemyride/ui";
import { SyntheticEvent, useState } from "react";

interface TripSearchBarProps {
  onSearch: (params: {
    origin?: Place;
    destination?: Place;
    date: string;
    vehicleType?: string;
  }) => void;
  isLoading?: boolean;
}

export function TripSearchBar({ onSearch, isLoading }: TripSearchBarProps) {
  const map = useMap();

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState<string>(today);
  const [originPlace, setOriginPlace] = useState<Place>();
  const [destinationPlace, setDestinationPlace] = useState<Place>();

  async function handleSelectOrigin(place: Place) {
    setOriginPlace(place);
    await updateMapMarkers(place, destinationPlace);
  }

  async function handleSelectDestination(place: Place) {
    setDestinationPlace(place);
    await updateMapMarkers(originPlace, place);
  }

  /**
   * Updates origin and destination markers on map without drawing route
   */
  async function updateMapMarkers(orig?: Place, dest?: Place) {
    try {
      await map.clearAllMarkers();
      await map.removeRoute();

      const pointsToFit: MapPoint[] = [];

      if (orig) {
        const origPoint: MapPoint = [orig.lng, orig.lat];
        await map.addMarker(origPoint);
        pointsToFit.push(origPoint);
      }

      if (dest) {
        const destPoint: MapPoint = [dest.lng, dest.lat];
        await map.addMarker(destPoint);
        pointsToFit.push(destPoint);
      }

      if (pointsToFit.length > 0) {
        await map.fitBounds(pointsToFit);
      }
    } catch (err) {
      console.error("Failed to update map markers:", err);
    }
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch({
      origin: originPlace,
      destination: destinationPlace,
      date,
    });
  }

  return (
    <div className="bg-surface-card border border-border-strong rounded-xl p-3.5 shadow-xs flex flex-col gap-3 flex-shrink-0">
      <div className="border-b border-border-subtle pb-2">
        <h3 className="font-semibold text-sm text-fg-primary">Search Rides</h3>
        <p className="text-[11px] text-fg-secondary">
          Find available carpools for your route
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Origin Input */}
        <div>
          <Label className="pb-1">Origin</Label>
          <MapSearchInput
            placeholder="Leaving from..."
            onSelectPlace={handleSelectOrigin}
          />
        </div>

        {/* Destination Input */}
        <div>
          <Label className="pb-1">Destination</Label>
          <MapSearchInput
            placeholder="Going to..."
            onSelectPlace={handleSelectDestination}
          />
        </div>

        {/* Date Input */}
        <div>
          <Label className="pb-1">Date</Label>
          <Input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="cursor-pointer py-1 text-xs h-[34px] w-full"
          />
        </div>

        {/* Search Button */}
        <Button type="submit" disabled={isLoading} variant="primary">
          <span>{isLoading ? "Searching..." : "Search Trips"}</span>
        </Button>
      </form>
    </div>
  );
}
