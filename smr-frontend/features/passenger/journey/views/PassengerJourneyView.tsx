"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Loader } from "@sharemyride/ui";
import { useMap } from "@/features/map/hooks/useMap";
import { MapPoint } from "@/features/map/types/MapTypes";
import { getPassengerJourneyDetailsRequest } from "../api/getPassengerJourneyDetailsRequest";
import { JourneyStatusHeader } from "../components/JourneyStatusHeader";
import { JourneyMapCard } from "../components/JourneyMapCard";
import { JourneyStopsProgress } from "../components/JourneyStopsProgress";
import { PassengerDetailsCard } from "../components/PassengerDetailsCard";
import { OtherPassengersCard } from "../components/OtherPassengersCard";

export function PassengerJourneyView() {
  const { journeyId } = useParams<{ journeyId: string }>();
  const map = useMap();

  const {
    data: journey,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["passengerJourneyDetails", journeyId],
    queryFn: () => getPassengerJourneyDetailsRequest(journeyId),
  });

  useEffect(() => {
    if (!journey) return;
    const currentJourney = journey;

    async function setupMapRoutes() {
      try {
        await map.clearAllMarkers();
        await map.clearAllRoutes();

        const origin: MapPoint = [
          currentJourney.origin.stop_lng,
          currentJourney.origin.stop_lat,
        ];
        const destination: MapPoint = [
          currentJourney.destination.stop_lng,
          currentJourney.destination.stop_lat,
        ];

        const pickupPoint: MapPoint = [
          currentJourney.my_details.pickup_location.stop_lng,
          currentJourney.my_details.pickup_location.stop_lat,
        ];
        const dropOffPoint: MapPoint = [
          currentJourney.my_details.drop_off_location.stop_lng,
          currentJourney.my_details.drop_off_location.stop_lat,
        ];

        const routeWaypoints: MapPoint[] = [
          origin,
          ...currentJourney.intermediate_stops.map(
            (stop): MapPoint => [stop.stop_lng, stop.stop_lat],
          ),
          destination,
        ];

        try {
          const routeData = await map.getRoute(routeWaypoints);
          if (routeData?.route) {
            await map.drawRoute(routeData.route, {
              id: "journey-full-route",
              color: "#9ca3af",
              width: 5,
              opacity: 0.5,
            });
          }
        } catch {
          await map.drawRoute(routeWaypoints, {
            id: "journey-full-route",
            color: "#9ca3af",
            width: 5,
          });
        }

        try {
          const passengerRouteData = await map.getRoute([
            pickupPoint,
            dropOffPoint,
          ]);
          if (passengerRouteData?.route) {
            await map.drawRoute(passengerRouteData.route, {
              id: "passenger-route",
              color: "#10b981",
              width: 6,
              opacity: 0.95,
            });
          }
        } catch {
          await map.drawRoute([pickupPoint, dropOffPoint], {
            id: "passenger-route",
            color: "#10b981",
            width: 6,
          });
        }

        await map.addMarker(origin);
        await map.addMarker(destination);
        await map.addMarker(pickupPoint);
        await map.addMarker(dropOffPoint);

        for (const stop of currentJourney.intermediate_stops) {
          await map.addMarker([stop.stop_lng, stop.stop_lat]);
        }

        await map.fitBounds([origin, destination]);
      } catch (err) {
        console.error("Failed to render journey map:", err);
      }
    }

    setupMapRoutes();
  }, [journey, map]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader />
        <p className="text-sm text-content-secondary animate-pulse">
          Loading journey details...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="rounded-xl border border-error-border bg-error-surface p-6 text-center text-error-content space-y-3">
          <h3 className="font-semibold text-lg">Error Loading Journey</h3>
          <p className="text-sm">
            {(error as Error)?.message || "Could not load journey details."}
          </p>
          <Button
            variant="secondary"
            className="text-xs py-1.5 px-3"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!journey) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
      <JourneyStatusHeader
        journeyId={journey.journey_id}
        journeyStatus={journey.journey_status}
        passengerStatus={journey.my_details.passenger_status}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map + Stops Progress (left/main column) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <JourneyMapCard
            origin={journey.origin}
            destination={journey.destination}
            intermediateStops={journey.intermediate_stops}
          />

          <JourneyStopsProgress
            origin={journey.origin}
            destination={journey.destination}
            intermediateStops={journey.intermediate_stops}
          />
        </div>

        {/* Passenger details + Peers (right column) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <PassengerDetailsCard myDetails={journey.my_details} />

          <OtherPassengersCard passengers={journey.other_passengers} />
        </div>
      </div>
    </div>
  );
}
