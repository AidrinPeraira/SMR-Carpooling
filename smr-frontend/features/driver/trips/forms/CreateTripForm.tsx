"use client";

import { MapSearchInput } from "@/features/map/components/MapSearchInput";
import { getDriverVehiclesRequest } from "@/features/profile/api/requests/getDriverVehiclesRequest";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DropDown,
  Input,
  Label,
  Loader,
  Tag,
} from "@sharemyride/ui";
import { useQuery } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

const AVAILABLE_TAGS = [
  "AC",
  "Non-smoking",
  "Pet friendly",
  "Luggage allowed",
  "Music allowed",
];

export function CreateTripForm() {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const [stopId, setStopId] = useState<number[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<{
    vehicleId: string;
    maxAvailableSeats: number;
  }>({ vehicleId: "", maxAvailableSeats: 0 });
  const [availableSeats, setAvailableSeats] = useState<number>(3);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "AC",
    "Non-smoking",
  ]);

  //get vehicle details from user profile
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["driverVehicles"],
    queryFn: getDriverVehiclesRequest,
  });

  useEffect(() => {
    if (vehicles && vehicles.length > 0 && !selectedVehicle.vehicleId) {
      const v = vehicles[0];
      const maxSeats = Math.max(1, v.vehicle_capacity - 1);
      setSelectedVehicle({
        vehicleId: v.vehicle_id,
        maxAvailableSeats: maxSeats,
      });
      setAvailableSeats((prev) => Math.min(prev, maxSeats));
    }
  }, [vehicles, selectedVehicle.vehicleId]);

  function handleVehicleChange(id: string) {
    const v = vehicles?.find((car) => car.vehicle_id === id);
    if (v) {
      const maxSeats = Math.max(1, v.vehicle_capacity - 1);
      setSelectedVehicle({
        vehicleId: v.vehicle_id,
        maxAvailableSeats: maxSeats,
      });
      setAvailableSeats((prev) => Math.min(prev, maxSeats));
    }
  }

  function handleDeleteStop(index: number) {
    setStopId((p) => p.filter((_v, i) => i !== index));
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  if (vehiclesLoading) return <Loader />;

  return (
    <Card className="w-full min-h-full">
      <CardHeader>
        <h2 className="text-lg font-bold text-fg-primary">Create a Trip</h2>
        <p className="text-xs text-fg-secondary">
          Offer a ride to passengers along your route.
        </p>
      </CardHeader>
      <CardBody className="flex flex-col gap-2 pt-3">
        {/*set origin*/}
        <div className="flex flex-col gap-2 mt-2">
          <Label>Select Origin</Label>
          <MapSearchInput />
        </div>

        {/*These are dynamically added stops*/}
        {stopId.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <Label>Intermediate Stops </Label>
            {stopId.map((id, index) => (
              <div className="flex" key={id}>
                <MapSearchInput />
                <Button
                  className="flex"
                  variant="ghost"
                  onClick={() => handleDeleteStop(index)}
                >
                  <Trash className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/*add stops button*/}
        <div>
          <Button
            variant="ghost"
            onClick={() => {
              setStopId((p) => [Date.now(), ...p]);
            }}
          >
            Add Stops +
          </Button>
        </div>

        {/*set destination*/}
        <div className="flex flex-col gap-2 mt-2">
          <Label>Select Destination</Label>
          <MapSearchInput />
        </div>

        {/*set vehicel*/}
        <div className="grid grid-cols-2 mt-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label>Select Vehicle</Label>
            <DropDown
              value={selectedVehicle.vehicleId}
              placeholder="Select Car"
              options={
                vehicles?.map((car) => ({
                  value: car.vehicle_id,
                  label: `${car.vehicle_make} ${car.vehicle_model}`,
                })) ?? []
              }
              onChange={handleVehicleChange}
            />
          </div>

          {/*select seats*/}
          <div className="flex flex-col gap-2">
            <Label>Available Seats</Label>
            <Input
              className="py-2"
              type="number"
              min={1}
              max={selectedVehicle.maxAvailableSeats}
              value={availableSeats}
              onChange={(e) => setAvailableSeats(Number(e.target.value))}
              placeholder="3"
            />
          </div>
        </div>

        {/*Trip Schedule*/}
        <div className="flex gap-2 mt-2">
          <div className="flex flex-col gap-2 flex-1">
            <Label>Departure Date</Label>
            <Input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <Label>Departure Time </Label>
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
        </div>

        {/*Tags*/}
        <div className="flex flex-col gap-2 mt-2">
          <Label>Trip Preferences / Tags</Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="cursor-pointer"
                >
                  <Tag variant={isSelected ? "accent" : "muted"}>
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </Tag>
                </button>
              );
            })}
          </div>
        </div>

        <Button className="mt-4">Create Trip</Button>
      </CardBody>
    </Card>
  );
}
