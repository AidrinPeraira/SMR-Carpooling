"use client";

import { useMap } from "@/features/map/hooks/useMap";
import { Place } from "@/features/map/types/MapTypes";
import { Input, Loader } from "@sharemyride/ui";
import { ChangeEvent, useEffect, useState } from "react";

interface MapSearchInputProps {
  onSelectPlace?: (place: Place) => void;
  placeholder?: string;
  className?: string;
}

/**
 * This component inmplements a resuable searc box set up
 * exclusively to call the search functionality for the map
 * service to show suggested places and send back selected
 * data to the handler function prrovided from the parent
 */
export function MapSearchInput({
  onSelectPlace,
  placeholder = "Search location...",
  className,
}: MapSearchInputProps) {
  const [search, setSearch] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const map = useMap();

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) {
      setPlaces([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await map.searchLocation(trimmed);
        setPlaces(results);
        setIsOpen(true);
      } catch (err) {
        console.error("Failed to search location:", err);
        setPlaces([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, map]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  async function handleSelect(place: Place) {
    setSearch(place.title || place.address);
    setIsOpen(false);
    onSelectPlace?.(place);
  }

  return (
    <div
      className={`relative flex flex-col w-full max-w-sm m-auto ${className || ""}`}
    >
      <Input value={search} onChange={handleChange} placeholder={placeholder} />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-border-strong bg-surface-card shadow-lg">
          {isLoading && <Loader className="m-auto my-2" />}

          {!isLoading && places.length === 0 && (
            <div className="p-3 text-xs text-content-secondary">
              No places found
            </div>
          )}

          {!isLoading && places.length > 0 && (
            <ul className="divide-y divide-border-weak">
              {places.map((place) => (
                <li
                  key={place.id}
                  onClick={() => handleSelect(place)}
                  className="cursor-pointer p-2.5 hover:bg-surface-hover transition-colors text-left"
                >
                  <div className="text-xs font-semibold text-content-primary">
                    {place.title}
                  </div>
                  <div className="text-[11px] text-content-secondary truncate">
                    {place.address}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
