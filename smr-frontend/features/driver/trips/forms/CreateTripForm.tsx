"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardHeader, DropDown, Input, Label } from "@sharemyride/ui";
import { Plus, Trash2 } from "lucide-react";

export function CreateTripForm() {
  const [stops, setStops] = useState<string[]>([]);

  const handleAddStop = () => {
    setStops((prev) => [...prev, ""]);
  };

  const handleRemoveStop = (index: number) => {
    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStopChange = (index: number, value: string) => {
    setStops((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-lg font-bold text-content-primary">Create a Trip</h2>
        <p className="text-xs text-content-secondary">
          Offer a ride to passengers along your route.
        </p>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        {/* Origin */}
        <div>
          <Label className="mb-1">Origin</Label>
          <Input placeholder="Enter starting location" />
        </div>

        {/* Dynamic Intermediate Stops */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Intermediate Stops (Optional)</Label>
            <button
              type="button"
              onClick={handleAddStop}
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Stop
            </button>
          </div>

          {stops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={stop}
                onChange={(e) => handleStopChange(index, e.target.value)}
                placeholder={`Stop ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveStop(index)}
                className="text-content-secondary hover:text-fg-danger p-1 transition-colors cursor-pointer"
                title="Remove stop"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Destination */}
        <div>
          <Label className="mb-1">Destination</Label>
          <Input placeholder="Enter destination location" />
        </div>

        {/* Vehicle */}
        <div>
          <Label className="mb-1">Vehicle</Label>
          <DropDown
            options={[
              { label: "Tesla Model 3 (WA 12345)", value: "tesla-m3" },
              { label: "Toyota Prius (OR 67890)", value: "prius" },
            ]}
            placeholder="Select vehicle"
          />
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1">Departure Date</Label>
            <Input type="date" />
          </div>
          <div>
            <Label className="mb-1">Departure Time</Label>
            <Input type="time" />
          </div>
        </div>

        {/* Seats & Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1">Available Seats</Label>
            <Input type="number" min={1} max={8} defaultValue={3} />
          </div>
          <div>
            <Label className="mb-1">Price per Seat ($)</Label>
            <Input type="number" min={0} step="0.5" placeholder="e.g. 25" />
          </div>
        </div>

        {/* Ride Preferences */}
        <div>
          <Label className="mb-2">Ride Preferences</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "quiet", label: "Quiet Ride" },
              { id: "no-smoking", label: "No Smoking" },
              { id: "pets", label: "Pets Allowed" },
              { id: "ac", label: "AC On" },
              { id: "music", label: "Music OK" },
            ].map((pref) => (
              <label
                key={pref.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border-strong bg-surface-muted text-content-secondary hover:border-accent text-xs cursor-pointer select-none transition-colors"
              >
                <input type="checkbox" className="rounded text-accent focus:ring-accent accent-accent" />
                <span>{pref.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full mt-2">
          Publish Trip
        </Button>
      </CardBody>
    </Card>
  );
}
