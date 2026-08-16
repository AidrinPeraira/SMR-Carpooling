"use client";

import { useRouter } from "next/navigation";
import {
  getJourneyDetailsRequest,
  GetJourneyDetailsResponse,
} from "@/features/passenger/trips/api/getJourneyDetailsRequest";
import { createBookingRequest } from "@/features/passenger/trips/api/createBookingRequest";
import { useMap } from "@/features/map/hooks/useMap";
import { MapPoint, Place } from "@/features/map/types/MapTypes";
import { ListTripsResult, TripStopDTO } from "@sharemyride/shared";
import { Button, DropDown, Loader, Tag, useToast } from "@sharemyride/ui";
import * as turf from "@turf/turf";
import { useEffect, useState } from "react";

interface TripListingCardProps {
  trip: ListTripsResult;
  isSelected: boolean;
  onSelect: () => void;
  passengerOrigin?: Place;
  passengerDestination?: Place;
}

/**
 * Calculates distance in kilometers along the actual route polyline between two points
 */
function getDistanceAlongRoute(
  pathCoordinates: [number, number][],
  pointACoords: [number, number],
  pointBCoords: [number, number],
): number {
  try {
    if (!pathCoordinates || pathCoordinates.length < 2) {
      const ptA = turf.point(pointACoords);
      const ptB = turf.point(pointBCoords);
      return turf.distance(ptA, ptB, { units: "kilometers" });
    }

    const route = turf.lineString(pathCoordinates);
    const ptA = turf.point(pointACoords);
    const ptB = turf.point(pointBCoords);

    const snappedA = turf.nearestPointOnLine(route, ptA);
    const snappedB = turf.nearestPointOnLine(route, ptB);

    const slicedRoute = turf.lineSlice(snappedA, snappedB, route);
    const distance = turf.length(slicedRoute, { units: "kilometers" });

    return Number(distance.toFixed(2));
  } catch (err) {
    console.error("Failed to compute distance along route with Turf:", err);
    const ptA = turf.point(pointACoords);
    const ptB = turf.point(pointBCoords);
    return turf.distance(ptA, ptB, { units: "kilometers" });
  }
}

export function TripListingCard({
  trip,
  isSelected,
  onSelect,
  passengerOrigin,
  passengerDestination,
}: TripListingCardProps) {
  const router = useRouter();
  const map = useMap();
  const toast = useToast();

  const [journeyDetails, setJourneyDetails] =
    useState<GetJourneyDetailsResponse | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const [selectedPickupStop, setSelectedPickupStop] =
    useState<TripStopDTO | null>(null);
  const [selectedDropoffStop, setSelectedDropoffStop] =
    useState<TripStopDTO | null>(null);

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [seatCount, setSeatCount] = useState<number>(1);

  async function handleBookingSubmit(e: React.MouseEvent) {
    e.stopPropagation();

    const pickupStop =
      selectedPickupStop ||
      (availableStopsList.length > 0
        ? availableStopsList[0]
        : trip.trip_origin);

    const dropoffStop =
      selectedDropoffStop ||
      (availableStopsList.length > 0
        ? availableStopsList[availableStopsList.length - 1]
        : trip.trip_destination);

    const flatRoute: [number, number][] =
      journeyDetails?.trip_route && journeyDetails.trip_route.length > 0
        ? Array.isArray(journeyDetails.trip_route[0])
          ? (journeyDetails.trip_route.flat(1) as unknown as [number, number][])
          : (journeyDetails.trip_route as unknown as [number, number][])
        : [];

    const distanceKm =
      getDistanceAlongRoute(
        flatRoute,
        [pickupStop.stop_lng, pickupStop.stop_lat],
        [dropoffStop.stop_lng, dropoffStop.stop_lat],
      ) || trip.trip_distance;

    setIsBooking(true);

    try {
      await createBookingRequest({
        trip_id: trip.trip_id,
        pickup_point: pickupStop,
        drop_off_point: dropoffStop,
        pickup_place_id: pickupStop.stop_name,
        drop_off_place_id: dropoffStop.stop_name,
        seat_count: seatCount,
        distance_km: distanceKm,
      });

      toast("Booking Requested", {
        variant: "success",
        description: "Your request to join this ride has been submitted.",
      });

      router.push("/passenger/bookings");
    } catch (err: unknown) {
      console.error("Failed to submit booking request:", err);
      toast("Booking Failed", {
        variant: "error",
        description:
          (err as Error)?.message ||
          "Failed to submit booking request. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  }

  // Fetch journey details when card is selected and render route on map
  useEffect(() => {
    async function loadDetails() {
      if (!isSelected) {
        setJourneyDetails(null);
        setSelectedPickupStop(null);
        setSelectedDropoffStop(null);
        setEstimatedPrice(null);
        return;
      }

      setIsLoadingDetails(true);

      try {
        const data = await getJourneyDetailsRequest(trip.trip_id);
        setJourneyDetails(data);

        // Keep stops unselected initially so placeholder displays cleanly
        setSelectedPickupStop(null);
        setSelectedDropoffStop(null);

        // Render trip route from backend coordinates if available
        if (data.trip_route && data.trip_route.length > 0) {
          try {
            const flatRoute = Array.isArray(data.trip_route[0])
              ? (data.trip_route.flat(1) as unknown as [number, number][])
              : (data.trip_route as unknown as [number, number][]);

            await map.drawRouteFromCoordinates(flatRoute);
          } catch (err) {
            console.error("Failed to render trip route:", err);
          }
        }

        // Initial fit bounds for the full trip stops
        if (data.trip_stops && data.trip_stops.length > 0) {
          const allPoints: MapPoint[] = data.trip_stops.map((s) => [
            s.stop_lng,
            s.stop_lat,
          ]);
          await map.fitBounds(allPoints);
        }
      } catch (err) {
        console.error("Failed to load journey details:", err);
        toast("Failed to load journey details", {
          variant: "error",
          description: "Could not retrieve details for this trip.",
        });
      } finally {
        setIsLoadingDetails(false);
      }
    }

    loadDetails();
  }, [isSelected, trip.trip_id, toast, map]);

  // Update map markers when boarding/drop-off stop selection changes
  useEffect(() => {
    if (!isSelected || !journeyDetails) return;

    async function updateMarkersOnMap() {
      try {
        await map.clearAllMarkers();

        if (selectedPickupStop) {
          const pickupPoint: MapPoint = [
            selectedPickupStop.stop_lng,
            selectedPickupStop.stop_lat,
          ];
          await map.addMarker(pickupPoint);
        }

        if (selectedDropoffStop) {
          const dropoffPoint: MapPoint = [
            selectedDropoffStop.stop_lng,
            selectedDropoffStop.stop_lat,
          ];
          await map.addMarker(dropoffPoint);
        }
      } catch (err) {
        console.error("Failed to update markers on map:", err);
      }
    }

    updateMarkersOnMap();
  }, [
    isSelected,
    journeyDetails,
    selectedPickupStop,
    selectedDropoffStop,
    map,
  ]);

  // Calculate pricing along actual route polyline using Turf.js
  useEffect(() => {
    async function calculatePrice() {
      if (!journeyDetails) {
        setEstimatedPrice(null);
        return;
      }

      const { base_price, price_per_km, trip_route } = journeyDetails;

      if (selectedPickupStop && selectedDropoffStop) {
        const flatRoute: [number, number][] =
          trip_route && trip_route.length > 0
            ? Array.isArray(trip_route[0])
              ? (trip_route.flat(1) as unknown as [number, number][])
              : (trip_route as unknown as [number, number][])
            : [];

        const routeDistanceKm = getDistanceAlongRoute(
          flatRoute,
          [selectedPickupStop.stop_lng, selectedPickupStop.stop_lat],
          [selectedDropoffStop.stop_lng, selectedDropoffStop.stop_lat],
        );

        const price = base_price + routeDistanceKm * price_per_km;
        setEstimatedPrice(Math.max(base_price, Math.round(price)));
      } else {
        const price = base_price + trip.trip_distance * price_per_km;
        setEstimatedPrice(Math.max(base_price, Math.round(price)));
      }
    }

    calculatePrice();
  }, [
    journeyDetails,
    selectedPickupStop,
    selectedDropoffStop,
    trip.trip_distance,
  ]);

  const formattedStartTime = new Date(trip.time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const availableStopsList =
    journeyDetails?.available_stops && journeyDetails.available_stops.length > 0
      ? journeyDetails.available_stops
      : journeyDetails?.trip_stops || [];

  // Calculate current pickup index in available_stops
  const pickupIndex =
    selectedPickupStop && journeyDetails
      ? availableStopsList.findIndex(
          (s) =>
            s.stop_lat === selectedPickupStop.stop_lat &&
            s.stop_lng === selectedPickupStop.stop_lng,
        )
      : -1;

  // Boarding point options: closest 5 stops to passenger's searched origin from available_stops
  const availableBoardingStopOptions = (() => {
    if (!journeyDetails || !availableStopsList.length) return [];

    const originLng = passengerOrigin
      ? passengerOrigin.lng
      : trip.trip_origin.stop_lng;
    const originLat = passengerOrigin
      ? passengerOrigin.lat
      : trip.trip_origin.stop_lat;

    const originPt = turf.point([originLng, originLat]);

    const stopsWithDist = availableStopsList
      .slice(0, -1) // Exclude final destination as boarding point
      .map((stop, index) => {
        const stopPt = turf.point([stop.stop_lng, stop.stop_lat]);
        const dist = turf.distance(originPt, stopPt, { units: "kilometers" });
        return { stop, index, dist };
      });

    // Sort by distance to passenger origin, take top 5, then re-sort by route index
    stopsWithDist.sort((a, b) => a.dist - b.dist);
    const closest5 = stopsWithDist.slice(0, 5);
    if (pickupIndex >= 0) {
      const selectedItem = stopsWithDist.find((s) => s.index === pickupIndex);
      if (selectedItem && !closest5.some((s) => s.index === pickupIndex)) {
        closest5.push(selectedItem);
      }
    }
    closest5.sort((a, b) => a.index - b.index);

    return closest5.map(({ stop, index }) => ({
      label: `${stop.stop_name} (${stop.stop_address})`,
      value: String(index),
    }));
  })();

  // Calculate current drop-off index in available_stops
  const dropoffIndex =
    selectedDropoffStop && journeyDetails
      ? availableStopsList.findIndex(
          (s) =>
            s.stop_lat === selectedDropoffStop.stop_lat &&
            s.stop_lng === selectedDropoffStop.stop_lng,
        )
      : -1;

  // Drop-off point options: closest 5 stops to passenger's searched destination from available_stops
  const availableDropoffStopOptions = (() => {
    if (!journeyDetails || !availableStopsList.length) return [];

    const destLng = passengerDestination
      ? passengerDestination.lng
      : trip.trip_destination.stop_lng;
    const destLat = passengerDestination
      ? passengerDestination.lat
      : trip.trip_destination.stop_lat;

    const destPt = turf.point([destLng, destLat]);

    const currentPickupIdx = pickupIndex >= 0 ? pickupIndex : -1;

    const downstreamStops = availableStopsList
      .map((stop, index) => ({ stop, index }))
      .filter((item) => item.index > currentPickupIdx)
      .map((item) => {
        const stopPt = turf.point([item.stop.stop_lng, item.stop.stop_lat]);
        const dist = turf.distance(destPt, stopPt, { units: "kilometers" });
        return { ...item, dist };
      });

    // Sort by distance to passenger destination, take top 5, then re-sort by route index
    downstreamStops.sort((a, b) => a.dist - b.dist);
    const closest5 = downstreamStops.slice(0, 5);
    if (dropoffIndex > currentPickupIdx) {
      const selectedItem = downstreamStops.find(
        (s) => s.index === dropoffIndex,
      );
      if (selectedItem && !closest5.some((s) => s.index === dropoffIndex)) {
        closest5.push(selectedItem);
      }
    }
    closest5.sort((a, b) => a.index - b.index);

    return closest5.map(({ stop, index }) => ({
      label: `${stop.stop_name} (${stop.stop_address})`,
      value: String(index),
    }));
  })();

  // Boarding DropDown value: String(index) if selected, or "" if unselected
  const pickupValue =
    selectedPickupStop && journeyDetails
      ? String(
          availableStopsList.findIndex(
            (s) =>
              s.stop_lat === selectedPickupStop.stop_lat &&
              s.stop_lng === selectedPickupStop.stop_lng,
          ),
        )
      : "";

  // Drop-off DropDown value: String(index) if selected, or "" if unselected
  const dropoffValue =
    selectedDropoffStop && journeyDetails
      ? String(
          availableStopsList.findIndex(
            (s) =>
              s.stop_lat === selectedDropoffStop.stop_lat &&
              s.stop_lng === selectedDropoffStop.stop_lng,
          ),
        )
      : "";

  return (
    <article
      onClick={() => !isSelected && onSelect()}
      className={`p-3 bg-surface-card border rounded-xl shadow-sm transition-all cursor-pointer ${
        isSelected
          ? "border-2 border-accent ring-1 ring-accent/30"
          : "border-border-strong hover:border-accent"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center mt-1">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-accent"></div>
            <div className="w-0.5 h-6 bg-border-strong my-1"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
          </div>
          <div>
            <div className="font-semibold text-sm text-fg-primary">
              {trip.trip_origin.stop_name}
            </div>
            <div className="text-xs text-fg-secondary mb-1">
              {formattedStartTime}
            </div>
            <div className="font-semibold text-sm text-fg-primary">
              {trip.trip_destination.stop_name}
            </div>
          </div>
        </div>

        {isSelected && (
          <span className="bg-accent text-accent-fg text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Selected
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle">
        <Tag variant="muted" className="text-xs py-0.5 px-2">
          {trip.trip_distance} km
        </Tag>
        <Tag variant="muted" className="text-xs py-0.5 px-2">
          {trip.seats_available} seats left
        </Tag>
        <Tag variant="accent" className="capitalize text-xs py-0.5 px-2">
          {trip.vehicle_type}
        </Tag>
      </div>

      {/* Expanded Pickup & Drop-off selection area when card is selected */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-border-strong bg-surface-muted/60 rounded-lg p-3 space-y-3">
          {isLoadingDetails ? (
            <div className="flex items-center justify-center p-4">
              <Loader className="h-5 w-5 text-accent animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div>
                  <label className="font-label-md text-[11px] text-content-secondary block mb-1">
                    Preferred Boarding Point
                  </label>
                  {availableBoardingStopOptions.length > 0 ? (
                    <DropDown
                      options={availableBoardingStopOptions}
                      value={pickupValue}
                      onChange={(val) => {
                        const newPickupIndex = Number(val);
                        if (
                          journeyDetails &&
                          availableStopsList[newPickupIndex]
                        ) {
                          const newPickup = availableStopsList[newPickupIndex];
                          setSelectedPickupStop(newPickup);

                          if (selectedDropoffStop !== null) {
                            const currentDropoffIndex =
                              availableStopsList.findIndex(
                                (s) =>
                                  s.stop_lat === selectedDropoffStop.stop_lat &&
                                  s.stop_lng === selectedDropoffStop.stop_lng,
                              );

                            if (
                              currentDropoffIndex !== -1 &&
                              currentDropoffIndex <= newPickupIndex
                            ) {
                              setSelectedDropoffStop(null);
                            }
                          }
                        }
                      }}
                      placeholder="Select Boarding Point"
                    />
                  ) : (
                    <div className="text-xs text-content-tertiary">
                      {trip.trip_origin.stop_name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-label-md text-[11px] text-content-secondary block mb-1">
                    Preferred Drop-off Point
                  </label>
                  {availableDropoffStopOptions.length > 0 ? (
                    <DropDown
                      options={availableDropoffStopOptions}
                      value={dropoffValue}
                      onChange={(val) => {
                        const index = Number(val);
                        if (journeyDetails && availableStopsList[index]) {
                          setSelectedDropoffStop(availableStopsList[index]);
                        }
                      }}
                      placeholder="Select Drop-off Point"
                    />
                  ) : (
                    <div className="text-xs text-content-tertiary">
                      {trip.trip_destination.stop_name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-label-md text-[11px] text-content-secondary block mb-1">
                    Seats Needed
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSeatCount((prev) => Math.max(1, prev - 1));
                      }}
                      disabled={seatCount <= 1}
                      className="w-7 h-7 flex items-center justify-center rounded border border-border-strong bg-surface-card text-fg-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-muted transition-colors font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-semibold text-fg-primary">
                      {seatCount}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSeatCount((prev) =>
                          Math.min(trip.seats_available, prev + 1),
                        );
                      }}
                      disabled={seatCount >= trip.seats_available}
                      className="w-7 h-7 flex items-center justify-center rounded border border-border-strong bg-surface-card text-fg-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-muted transition-colors font-bold text-sm"
                    >
                      +
                    </button>
                    <span className="text-[10px] text-fg-secondary ml-1">
                      (Max {trip.seats_available} seat
                      {trip.seats_available === 1 ? "" : "s"})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border-subtle">
                <div>
                  <div className="font-headline-md text-base text-fg-primary font-bold">
                    ₹
                    {estimatedPrice !== null
                      ? estimatedPrice * seatCount
                      : "--"}
                  </div>
                  <div className="text-[10px] text-fg-secondary">
                    {estimatedPrice !== null && seatCount > 1
                      ? `Total Price (₹${estimatedPrice} × ${seatCount} seats)`
                      : "Estimated Price (INR)"}
                  </div>
                </div>
                <Button
                  variant="primary"
                  disabled={isBooking || isLoadingDetails}
                  onClick={handleBookingSubmit}
                >
                  {isBooking ? (
                    <div className="flex items-center gap-2">
                      <Loader className="h-4 w-4 text-accent-fg animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Request to Join"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}
