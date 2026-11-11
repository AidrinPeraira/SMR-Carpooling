"use client";

import { useMap } from "@/features/map/hooks/useMap";
import { Place, SearchSuggestion } from "@/features/map/types/MapTypes";
import { Input, Loader, useToast } from "@sharemyride/ui";
import { ChangeEvent, useEffect, useRef, useState } from "react";

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
  const [searchString, setSearchString] = useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = useState<
    SearchSuggestion[]
  >([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const justSelectedFlag = useRef(false);

  const map = useMap();
  const toast = useToast();

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchString(e.target.value);
  }

  /**
   * Fetches place coordinates and calls the onSelectPlace handler provided by parent
   */
  async function handleOnSelect(suggestion: SearchSuggestion) {
    setSearchString(suggestion.title || suggestion.address);
    setSearchSuggestions([]);
    setIsOpen(false);
    justSelectedFlag.current = true;

    try {
      const place = await map.getPlaceDetails(suggestion);
      onSelectPlace?.(place);
    } catch (error) {
      console.error("Failed to retrieve place details:", error);
      toast("Failed to get place coordinates");
    }
  }

  useEffect(() => {
    if (justSelectedFlag.current) {
      justSelectedFlag.current = false;
      return;
    }

    const trimmed = searchString.trim();
    if (!trimmed) {
      queueMicrotask(() => {
        setSearchSuggestions([]);
        setIsOpen(false);
        setIsPending(false);
      });
      return;
    }

    const timer = setTimeout(() => {
      setIsPending(true);
      setIsOpen(true);

      map
        .searchSuggestions(trimmed)
        .then((data) => {
          setSearchSuggestions(data);
        })
        .catch((error) => {
          console.error("Failed to get search suggestions: ", error);
          toast("Failed to get search suggestions");
          setSearchSuggestions([]);
        })
        .finally(() => {
          setIsPending(false);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchString, map, toast]);

  return (
    <div
      className={`relative flex flex-col w-full max-w-sm ${className || ""}`}
    >
      <Input
        value={searchString}
        placeholder={placeholder}
        onChange={handleInputChange}
      />

      {/* Suggestions drop down */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-lg border border-border-strong bg-surface-card shadow-lg transition-all">
          {isPending ? (
            <div className="flex items-center justify-center p-4">
              <Loader className="h-5 w-5 text-accent animate-spin" />
            </div>
          ) : (
            <div>
              {searchSuggestions.length === 0 ? (
                <div className="p-3 text-xs text-content-tertiary text-center">
                  No suggestions found
                </div>
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {searchSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      onClick={() => handleOnSelect(suggestion)}
                      className="cursor-pointer p-3 hover:bg-surface-muted transition-colors text-left"
                    >
                      <div className="text-xs font-semibold text-content-primary">
                        {suggestion.title}
                      </div>
                      <div className="text-[11px] text-content-secondary truncate mt-0.5">
                        {suggestion.address}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
