"use client";

import { MapContainer } from "@/features/map/components/MapContainer";
import { DirectionsCard } from "@/features/driver/journey/components/DirectionsCard";
import { Compass, Layers } from "lucide-react";

export function NavigationMap() {
  return (
    <section className="relative h-full w-full flex flex-col">
      <div className="absolute inset-0">
        <MapContainer enableLocationTracking />
      </div>

      <div className="relative z-10 p-4 max-w-xl">
        <DirectionsCard />
      </div>

      <div className="relative z-10 mt-auto p-4 flex items-end justify-end">
        <div className="flex flex-col gap-2">
          <button
            className="w-10 h-10 rounded-full bg-surface-card text-content-primary shadow-md border border-border-subtle flex items-center justify-center active:scale-95 transition-all"
            title="Re-center"
          >
            <Compass className="w-5 h-5 text-accent" />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-surface-card text-content-primary shadow-md border border-border-subtle flex items-center justify-center active:scale-95 transition-all"
            title="Map Layers"
          >
            <Layers className="w-5 h-5 text-content-secondary" />
          </button>
        </div>
      </div>
    </section>
  );
}
