"use client";

import { NavigationDrawer } from "@/features/driver/journey/components/NavigationDrawer";
import { NavigationMap } from "@/features/driver/journey/components/NavigationMap";

export function DriverJourneyView() {
  return (
    <div className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden">
      <div className="absolute inset-0 lg:relative lg:inset-auto flex-1 h-full w-full">
        <NavigationMap />
      </div>
      <NavigationDrawer />
    </div>
  );
}
