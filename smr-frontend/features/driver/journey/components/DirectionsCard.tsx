"use client";

import { useState } from "react";
import { CornerUpLeft, Volume2 } from "lucide-react";
import { JourneyStatus } from "@sharemyride/shared";

interface DirectionsCardProps {
  journeyStatus: JourneyStatus;
}

export function DirectionsCard({ journeyStatus }: DirectionsCardProps) {
  const [status] = useState(journeyStatus);

  if (status !== JourneyStatus.ONGOING) return null;

  return (
    <div className="bg-accent text-accent-fg rounded-xl p-4 shadow-lg flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-lg bg-accent-fg/10 flex items-center justify-center shrink-0">
          <CornerUpLeft className="w-7 h-7 text-accent-fg" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold leading-none">
              In 400 m
            </span>
            <span className="px-1.5 py-0.5 rounded bg-surface-card/20 text-[10px] font-bold tracking-wider uppercase shrink-0">
              Lane 2
            </span>
          </div>
          <p className="text-sm font-semibold mt-0.5 opacity-95">
            Turn left onto CV Raman Rd
          </p>
          <p className="text-xs mt-0.5 opacity-70">
            Then continue toward Mathikere Post Office
          </p>
        </div>
      </div>
      <button
        className="w-10 h-10 rounded-full bg-accent-fg/10 hover:bg-accent-fg/20 flex items-center justify-center transition-all shrink-0 ml-3"
        title="Mute/Unmute Guidance"
      >
        <Volume2 className="w-5 h-5" />
      </button>
    </div>
  );
}
