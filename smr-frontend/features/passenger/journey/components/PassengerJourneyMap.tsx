"use client";

import { useEffect, useRef } from "react";
import { Card } from "@sharemyride/ui";
import { Locate, Navigation } from "lucide-react";
import { MapPoint } from "@/features/map/types/MapTypes";
import { MapContainer } from "@/features/map/components/MapContainer";
import { useMap } from "@/features/map/hooks/useMap";
import {
  GetPassengerJourneyDetailsResult,
  SocketEvents,
  StopType,
} from "@sharemyride/shared";
import { Socket } from "socket.io-client";

interface PassengerMapProps {
  journeySocket: Socket;
  journey: GetPassengerJourneyDetailsResult;
}

export function PassengerJourneyMap({
  journeySocket,
  journey,
}: PassengerMapProps) {
  const map = useMap();
  const routeWaypoints = useRef<MapPoint[]>([]);

  useEffect(() => {
    async function setupMap() {
      await map.clearAllMarkers();
      await map.clearAllRoutes();

      const origin: MapPoint = [
        journey.origin.stop_lng,
        journey.origin.stop_lat,
      ];
      const destination: MapPoint = [
        journey.destination.stop_lng,
        journey.destination.stop_lat,
      ];

      const waypoints: MapPoint[] = [
        origin,
        ...journey.intermediate_stops.map(
          (s) => [s.stop_lng, s.stop_lat] as MapPoint,
        ),
        destination,
      ];

      const route = await map.getRoute(waypoints);
      await map.drawRoute(route.route, {
        id: "journey-route",
        color: "#94a3b8",
        opacity: 0.45,
        width: 4,
      });

      for (const stop of journey.intermediate_stops) {
        await map.addMarkerWithLabel(
          [stop.stop_lng, stop.stop_lat],
          `${stop.stop_type == StopType.PICKUP ? "Pick-Up" : "Drop-Off"}: ${stop.passenger_name}`,
        );
      }

      routeWaypoints.current = waypoints;
      await map.fitBounds(waypoints);
    }

    setupMap();
  }, [map, journey]);

  const driverMarkerAdded = useRef(false);

  useEffect(() => {
    journeySocket.on(
      SocketEvents.JOURNEY_LOCATION_BROADCAST,
      async (data: {
        lat: number;
        lng: number;
        heading: number;
        speed: number;
        timestamp: number;
      }) => {
        const point: MapPoint = [data.lng, data.lat];
        if (!driverMarkerAdded.current) {
          await map.addDriverMarker(point);
          driverMarkerAdded.current = true;
        } else {
          await map.updateDriverMarkerPosition(point);
        }
      },
    );

    return () => {
      journeySocket.off(SocketEvents.JOURNEY_LOCATION_BROADCAST);
      if (driverMarkerAdded.current) {
        map.removeDriverMarker();
        driverMarkerAdded.current = false;
      }
    };
  }, [journeySocket, map]);

  function centerOnRoute() {
    if (routeWaypoints.current.length > 0) {
      map.fitBounds(routeWaypoints.current);
    }
  }

  return (
    <Card className="border border-border-subtle bg-surface-card overflow-hidden shadow-sm p-0">
      <div className="p-3 border-b border-border-subtle flex items-center justify-between bg-surface-muted/50 text-xs">
        <span className="font-semibold text-content-primary flex items-center gap-2">
          <Navigation className="w-4 h-4 text-accent" />
          Live Journey Map
        </span>
        <span className="text-content-secondary text-[11px]">
          {journey.origin.stop_name} → {journey.destination.stop_name}
        </span>
      </div>
      <div className="h-64 sm:h-80 w-full relative">
        <MapContainer />
        <button
          className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card text-content-primary text-xs font-medium shadow-md border border-border-subtle active:scale-95 transition-all"
          onClick={centerOnRoute}
        >
          <Locate className="w-3.5 h-3.5 text-accent" />
          Re-Center
        </button>
      </div>
    </Card>
  );
}
