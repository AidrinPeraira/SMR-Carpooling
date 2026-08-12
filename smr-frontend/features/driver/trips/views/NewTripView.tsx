"use client";

import { useState } from "react";
import { CreateTripForm } from "@/features/driver/trips/forms/CreateTripForm";
import { MapContainer } from "@/features/map/components/MapContainer";
import { ChevronDown, ChevronUp } from "lucide-react";

export function NewTripView() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden">
      {/* Map (Fixed Right Side on desktop, Full Background on mobile/tablet) */}
      <div className="absolute inset-0 lg:relative lg:inset-auto flex-1 h-full w-full">
        <MapContainer />
      </div>

      {/* Left Form Panel (Bottom Drawer on md and smaller, Scrollable Left Sidebar on lg+) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-20 bg-surface-card border-t border-border-strong rounded-t-2xl shadow-2xl transition-all duration-300 ${
          isOpen ? "max-h-[75vh]" : "max-h-12 overflow-hidden"
        } lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:max-h-full lg:h-full lg:w-full lg:max-w-sm lg:flex-shrink-0 lg:rounded-none lg:border-t-0 lg:border-r lg:shadow-none lg:z-auto lg:bg-surface-base flex flex-col`}
      >
        {/* Toggle Button for Mobile/Tablet Drawer */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2.5 px-4 flex items-center justify-between text-xs font-semibold text-content-secondary border-b border-border-strong/50 bg-surface-muted/50 rounded-t-2xl lg:hidden cursor-pointer hover:bg-surface-muted transition-colors flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <span className="w-8 h-1 bg-border-strong rounded-full inline-block" />
            <span>{isOpen ? "Collapse Form" : "Create Trip Form"}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>

        {/* Scrollable Form Container */}
        <div className="overflow-y-auto p-2 lg:p-2 bg-transparent flex-1">
          <CreateTripForm />
        </div>
      </div>
    </div>
  );
}
