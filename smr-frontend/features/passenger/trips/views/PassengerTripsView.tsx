"use client";

import { MapContainer } from "@/features/map/components/MapContainer";
import { getTripsRequest } from "@/features/passenger/trips/api/getTripsRequest";
import { TripListingCard } from "@/features/passenger/trips/components/TripListingCard";
import { TripSearchBar } from "@/features/passenger/trips/components/TripSearchBar";
import { Place } from "@/features/map/types/MapTypes";
import {
  ListTripsResult,
  PaginatedPayload,
  SortOrder,
} from "@sharemyride/shared";
import { Button, Loader, useToast } from "@sharemyride/ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function PassengerTripsView() {
  const toast = useToast();

  const [tripsPayload, setTripsPayload] =
    useState<PaginatedPayload<ListTripsResult[]> | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [lastSearchParams, setLastSearchParams] = useState<{
    origin?: Place;
    destination?: Place;
    date: string;
    vehicleType?: string;
  } | null>(null);

  async function handleSearch(params: {
    origin?: Place;
    destination?: Place;
    date: string;
    vehicleType?: string;
  }) {
    setLastSearchParams(params);
    setCurrentPage(1);
    await executeSearch(params, 1);
  }

  async function executeSearch(
    params: {
      origin?: Place;
      destination?: Place;
      date: string;
      vehicleType?: string;
    },
    page: number,
  ) {
    if (!params.origin || !params.destination) {
      toast("Selection Required", {
        variant: "warn",
        description: "Please select both Origin and Destination locations before searching.",
      });
      return;
    }

    setIsLoading(true);
    setSelectedTripId(null); // Keep all trips unselected by default

    try {
      const searchDate = params.date ? new Date(params.date) : new Date();

      const payload = await getTripsRequest({
        origin: {
          stop_lat: params.origin.lat,
          stop_lng: params.origin.lng,
          stop_name: params.origin.title || params.origin.address || "Origin",
          stop_address: params.origin.address || "Origin Address",
        },
        destination: {
          stop_lat: params.destination.lat,
          stop_lng: params.destination.lng,
          stop_name:
            params.destination.title ||
            params.destination.address ||
            "Destination",
          stop_address: params.destination.address || "Destination Address",
        },
        time: searchDate,
        query: {
          page,
          limit: 10,
          sortValue: SortOrder.ASC,
        },
      });

      setTripsPayload(payload);
      if (payload.data.length === 0) {
        toast("No Trips Found", {
          variant: "warn",
          description: "No matching trips were found for your selected route and date.",
        });
      }
    } catch (err) {
      console.error("Failed to search trips:", err);
      toast("Search Failed", {
        variant: "error",
        description: "Unable to retrieve trips. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handlePageChange(newPage: number) {
    if (
      newPage < 1 ||
      (tripsPayload && newPage > tripsPayload.paginationMeta.totalPages)
    ) {
      return;
    }
    setCurrentPage(newPage);
    if (lastSearchParams) {
      executeSearch(lastSearchParams, newPage);
    }
  }

  const trips = tripsPayload?.data || [];
  const totalItems = tripsPayload?.paginationMeta.totalItems ?? 0;

  return (
    <div className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden bg-surface-base">
      {/* Map (Fixed Right Side on desktop, Full Background on mobile/tablet) */}
      <div className="absolute inset-0 lg:relative lg:inset-auto flex-1 h-full w-full">
        <MapContainer enableLocationTracking className="h-full w-full" />
      </div>

      {/* Left Sidebar / Collapsible Drawer Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-20 bg-surface-card border-t border-border-strong rounded-t-2xl shadow-2xl transition-all duration-300 ${
          isOpen ? "max-h-[85vh]" : "max-h-12 overflow-hidden"
        } lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:max-h-full lg:h-full lg:w-full lg:max-w-md lg:flex-shrink-0 lg:rounded-none lg:border-t-0 lg:border-r lg:shadow-none lg:z-auto lg:bg-surface-base flex flex-col`}
      >
        {/* Toggle Button for Mobile/Tablet Drawer */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2.5 px-4 flex items-center justify-between text-xs font-semibold text-content-secondary border-b border-border-strong/50 bg-surface-muted/50 rounded-t-2xl lg:hidden cursor-pointer hover:bg-surface-muted transition-colors flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <span className="w-8 h-1 bg-border-strong rounded-full inline-block" />
            <span>
              {isOpen
                ? `Collapse Search & Results (${totalItems})`
                : `Expand Search & Results (${totalItems})`}
            </span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>

        {/* Scrollable Sidebar Container */}
        <div className="overflow-y-auto p-3.5 space-y-3.5 flex-1">
          {/* In-sidebar Search Bar */}
          <TripSearchBar onSearch={handleSearch} isLoading={isLoading} />

          {/* Results Summary Header */}
          <div className="p-2 border-b border-border-subtle flex justify-between items-center">
            <h2 className="font-semibold text-xs text-fg-primary uppercase tracking-wider">
              {isLoading
                ? "Searching trips..."
                : `${totalItems} Trip${totalItems === 1 ? "" : "s"} Available`}
            </h2>
          </div>

          {/* Trips List */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 gap-2">
              <Loader className="h-6 w-6 text-accent animate-spin" />
              <span className="text-xs text-content-secondary">
                Searching matching trips...
              </span>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center p-8 text-content-secondary text-xs bg-surface-card border border-border-subtle rounded-xl">
              No trips found. Select your origin and destination and click Search.
            </div>
          ) : (
            trips.map((trip) => (
              <TripListingCard
                key={trip.trip_id}
                trip={trip}
                isSelected={selectedTripId === trip.trip_id}
                onSelect={() =>
                  setSelectedTripId(
                    selectedTripId === trip.trip_id ? null : trip.trip_id,
                  )
                }
                passengerOrigin={lastSearchParams?.origin}
                passengerDestination={lastSearchParams?.destination}
              />
            ))
          )}

          {/* Pagination */}
          {tripsPayload && tripsPayload.paginationMeta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-3 mt-3 border-t border-border-subtle">
              <Button
                variant="secondary"
                className="w-7 h-7 p-0 flex items-center justify-center text-xs"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                &lt;
              </Button>
              <span className="text-xs text-content-secondary px-2">
                Page {currentPage} of{" "}
                {tripsPayload.paginationMeta.totalPages}
              </span>
              <Button
                variant="secondary"
                className="w-7 h-7 p-0 flex items-center justify-center text-xs"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage >= tripsPayload.paginationMeta.totalPages
                }
              >
                &gt;
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
