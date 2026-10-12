"use client";

import {
  CornerUpLeft,
  CornerUpRight,
  ArrowUp,
  RotateCw,
  MapPin,
  Navigation,
  Route,
} from "lucide-react";
import { JourneyStatus } from "@sharemyride/shared";
import { NavigationState } from "@/features/map/types/MapTypes";

interface DirectionsCardProps {
  journeyStatus: JourneyStatus;
  navigationState: NavigationState | null;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}

function getManeuverIcon(type: string, modifier?: string) {
  const iconClass = "w-6 h-6";

  if (type === "arrive") return <MapPin className={iconClass} />;
  if (type === "depart") return <Navigation className={iconClass} />;
  if (type === "roundabout" || type === "rotary")
    return <RotateCw className={iconClass} />;

  if (modifier?.includes("left")) return <CornerUpLeft className={iconClass} />;
  if (modifier?.includes("right"))
    return <CornerUpRight className={iconClass} />;

  return <ArrowUp className={iconClass} />;
}

export function DirectionsCard({
  journeyStatus,
  navigationState,
}: DirectionsCardProps) {
  if (journeyStatus !== JourneyStatus.ONGOING) return null;
  if (!navigationState?.currentStep) return null;

  const {
    currentStep,
    distanceToNextManeuver,
    currentRoute,
    currentSegmentIndex,
    totalSegments,
  } = navigationState;

  return (
    <div className="bg-surface-card border border-border-subtle rounded-2xl shadow-lg overflow-hidden">
      <div className="flex items-center gap-3.5 p-4">
        <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
          {getManeuverIcon(
            currentStep.maneuver.type,
            currentStep.maneuver.modifier,
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-content-primary truncate">
            {currentStep.maneuver.instruction}
          </p>
          {currentStep.name && (
            <p className="text-xs text-content-secondary mt-0.5 truncate">
              {currentStep.name}
            </p>
          )}
        </div>

        <div className="text-right shrink-0 pl-2">
          <span className="text-xl font-extrabold text-content-primary leading-none">
            {formatDistance(distanceToNextManeuver)}
          </span>
        </div>
      </div>

      {currentRoute && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-surface-muted/60 border-t border-border-subtle">
          <div className="flex items-center gap-1.5 text-xs text-content-secondary">
            <Route className="w-3.5 h-3.5" />
            <span className="font-medium">
              {currentRoute.totalLengthKm} km
            </span>
            <span className="text-content-tertiary mx-0.5">·</span>
            <span className="font-medium">
              {formatDuration(currentRoute.totalTimeMin * 60)}
            </span>
          </div>
          {totalSegments > 1 && (
            <span className="text-[10px] font-bold text-content-tertiary tracking-wider uppercase">
              Leg {currentSegmentIndex + 1}/{totalSegments}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
