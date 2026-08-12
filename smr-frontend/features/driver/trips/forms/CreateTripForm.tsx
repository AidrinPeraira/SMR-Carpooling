"use client";

import { MapSearchInput } from "@/features/map/components/MapSearchInput";
import { useMap } from "@/features/map/hooks/useMap";
import { MapPoint, Place } from "@/features/map/types/MapTypes";
import { getDriverVehiclesRequest } from "@/features/profile/api/requests/getDriverVehiclesRequest";
import { apiClientFetch } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { CreateTripSchema } from "@sharemyride/shared";
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
  useToast,
} from "@sharemyride/ui";
import { useQuery } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
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

  const map = useMap();
  const toast = useToast();
  const router = useRouter();

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
  const [tripStops, setTripStops] = useState<(Place | undefined)[]>([]);
  const [tripOrigin, setTripOrigin] = useState<Place>();
  const [tripDestination, setTripDestination] = useState<Place>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    console.log("Dest: ", tripDestination);
    console.log("Origin: ", tripOrigin);
  }, [tripOrigin, tripDestination]);

  //get vehicle details from user profile
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["driverVehicles"],
    queryFn: getDriverVehiclesRequest,
  });

  useEffect(() => {
    if (vehicles && vehicles.length > 0 && !selectedVehicle.vehicleId) {
      const v = vehicles[0];
      const maxSeats = Math.max(1, v.vehicle_capacity - 1);
      queueMicrotask(() => {
        setSelectedVehicle({
          vehicleId: v.vehicle_id,
          maxAvailableSeats: maxSeats,
        });
        setAvailableSeats((prev) => Math.min(prev, maxSeats));
      });
    }
  }, [vehicles, selectedVehicle.vehicleId]);

  // Recalculate route on map whenever origin, destination, or intermediate stops change
  useEffect(() => {
    async function updateRoute() {
      if (tripOrigin && tripDestination) {
        const validStops = tripStops.filter((s): s is Place => Boolean(s));
        const waypoints: MapPoint[] = [
          [tripOrigin.lng, tripOrigin.lat],
          ...validStops.map((s) => [s.lng, s.lat] as MapPoint),
          [tripDestination.lng, tripDestination.lat],
        ];

        try {
          const routeData = await map.getRoute(waypoints);
          if (routeData?.route) {
            await map.drawRoute(routeData.route);
            await map.fitBounds(waypoints);
          }
        } catch (err) {
          console.error("Failed to update route on map:", err);
        }
      }
    }
    updateRoute();
  }, [tripOrigin, tripDestination, tripStops, map]);

  function handleVehicleChange(id: string) {
    const v = vehicles?.find((car) => car.vehicle_id === id);
    if (v) {
      const maxSeats = Math.max(1, v.vehicle_capacity - 1);
      setSelectedVehicle({
        vehicleId: v.vehicle_id,
        maxAvailableSeats: maxSeats,
      });
      setAvailableSeats((prev) => Math.min(prev, maxSeats));
      setErrors((prev) => ({ ...prev, vehicle_id: "" }));
    }
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  async function handleSelectOrigin(place: Place) {
    if (tripOrigin) {
      await map.removeMarker([tripOrigin.lng, tripOrigin.lat]);
    }
    await map.addMarker([place.lng, place.lat]);

    //craft an array of all points
    const validStops = tripStops.filter((s): s is Place => Boolean(s));
    const allPoints: MapPoint[] = [
      [place.lng, place.lat],
      ...validStops.map((s) => [s.lng, s.lat] as MapPoint),
      ...(tripDestination
        ? [[tripDestination.lng, tripDestination.lat] as MapPoint]
        : []),
    ];

    await map.fitBounds(allPoints);
    setTripOrigin(place);
    setErrors((prev) => ({ ...prev, trip_origin: "" }));
  }

  async function handleSelectDestination(place: Place) {
    if (tripDestination) {
      await map.removeMarker([tripDestination.lng, tripDestination.lat]);
    }
    await map.addMarker([place.lng, place.lat]);

    //craft an array of all points
    const validStops = tripStops.filter((s): s is Place => Boolean(s));
    const allPoints: MapPoint[] = [
      [place.lng, place.lat],
      ...validStops.map((s) => [s.lng, s.lat] as MapPoint),
      ...(tripOrigin ? [[tripOrigin.lng, tripOrigin.lat] as MapPoint] : []),
    ];

    await map.fitBounds(allPoints);

    setTripDestination(place);
    setErrors((prev) => ({ ...prev, trip_destination: "" }));
  }

  async function handleAddStop(index: number, place: Place) {
    const existingStop = tripStops[index];
    if (existingStop) {
      await map.removeMarker([existingStop.lng, existingStop.lat]);
    }
    await map.addMarker([place.lng, place.lat]);

    const updatedStops = [...tripStops];
    updatedStops[index] = place;
    setTripStops(updatedStops);

    const validStops = updatedStops.filter((s): s is Place => Boolean(s));
    const allPoints: MapPoint[] = [
      ...(tripOrigin ? [[tripOrigin.lng, tripOrigin.lat] as MapPoint] : []),
      ...validStops.map((s) => [s.lng, s.lat] as MapPoint),
      ...(tripDestination
        ? [[tripDestination.lng, tripDestination.lat] as MapPoint]
        : []),
    ];

    if (allPoints.length > 0) {
      await map.fitBounds(allPoints);
    }
  }

  async function handleDeleteStop(index: number) {
    const stopToRemove = tripStops[index];
    if (stopToRemove) {
      await map.removeMarker([stopToRemove.lng, stopToRemove.lat]);
    }

    setStopId((p) => p.filter((_v, i) => i !== index));

    const updatedStops = tripStops.filter((_, i) => i !== index);
    setTripStops(updatedStops);

    const validStops = updatedStops.filter((s): s is Place => Boolean(s));
    const allPoints: MapPoint[] = [
      ...(tripOrigin ? [[tripOrigin.lng, tripOrigin.lat] as MapPoint] : []),
      ...validStops.map((s) => [s.lng, s.lat] as MapPoint),
      ...(tripDestination
        ? [[tripDestination.lng, tripDestination.lat] as MapPoint]
        : []),
    ];

    if (allPoints.length > 0) {
      await map.fitBounds(allPoints);
    }
  }

  async function handleSubmit() {
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!tripOrigin) newErrors.trip_origin = "Origin is required";
    if (!tripDestination)
      newErrors.trip_destination = "Destination is required";
    if (!selectedVehicle.vehicleId)
      newErrors.vehicle_id = "Vehicle is required";
    if (!selectedDate || !selectedTime)
      newErrors.start_time = "Departure date and time are required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast("Please fill in all required fields", { variant: "warn" });
      return;
    }

    try {
      setIsSubmitting(true);

      const validStops = tripStops.filter((s): s is Place => Boolean(s));
      const waypoints: MapPoint[] = [
        [tripOrigin!.lng, tripOrigin!.lat],
        ...validStops.map((s) => [s.lng, s.lat] as MapPoint),
        [tripDestination!.lng, tripDestination!.lat],
      ];

      const routeData = await map.getRoute(waypoints);

      const originStop = {
        stop_name: tripOrigin!.title,
        stop_address: tripOrigin!.address,
        stop_lat: tripOrigin!.lat,
        stop_lng: tripOrigin!.lng,
      };

      const destinationStop = {
        stop_name: tripDestination!.title,
        stop_address: tripDestination!.address,
        stop_lat: tripDestination!.lat,
        stop_lng: tripDestination!.lng,
      };

      const intermediateStops = validStops.map((s) => ({
        stop_name: s.title,
        stop_address: s.address,
        stop_lat: s.lat,
        stop_lng: s.lng,
      }));

      const startTime = new Date(`${selectedDate}T${selectedTime}`);

      const rawPayload = {
        vehicle_id: selectedVehicle.vehicleId,
        trip_origin: originStop,
        trip_destination: destinationStop,
        trip_stops: [originStop, ...intermediateStops, destinationStop],
        trip_route: routeData.route,
        trip_distance: routeData.totalLengthKm,
        available_seats: availableSeats,
        total_seats: selectedVehicle.maxAvailableSeats + 1,
        trip_tags: selectedTags,
        start_time: startTime,
      };

      const validationResult = CreateTripSchema.safeParse(rawPayload);

      if (!validationResult.success) {
        const errMap: Record<string, string> = {};
        for (const issue of validationResult.error.issues) {
          const field = String(issue.path[0]);
          if (field && !errMap[field]) {
            errMap[field] = issue.message;
          }
        }
        setErrors(errMap);
        toast("Please fix form errors before submitting", { variant: "warn" });
        return;
      }

      await apiClientFetch("/api/v1/trips", {
        method: "POST",
        body: JSON.stringify(validationResult.data),
      });

      toast("Trip created successfully!", { variant: "success" });
      router.push("/driver/trips");
    } catch (err: unknown) {
      logger.error("Failed to submit create trip form: ", err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create trip";
      toast(errorMsg, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (vehiclesLoading)
    return (
      <div className="m-auto">
        <Loader />
      </div>
    );

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
          <MapSearchInput onSelectPlace={handleSelectOrigin} />
          {errors.trip_origin && (
            <span className="text-xs text-red-500">{errors.trip_origin}</span>
          )}
        </div>

        {/*These are dynamically added stops*/}
        {stopId.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <Label>Intermediate Stops </Label>
            {stopId.map((id, index) => (
              <div className="flex" key={id}>
                <MapSearchInput
                  onSelectPlace={(place) => handleAddStop(index, place)}
                />
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
              setStopId((p) => [...p, Date.now()]);
              setTripStops((p) => [...p, undefined]);
            }}
          >
            Add Stops +
          </Button>
        </div>

        {/*set destination*/}
        <div className="flex flex-col gap-2 mt-2">
          <Label>Select Destination</Label>
          <MapSearchInput onSelectPlace={handleSelectDestination} />
          {errors.trip_destination && (
            <span className="text-xs text-red-500">
              {errors.trip_destination}
            </span>
          )}
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
            {errors.vehicle_id && (
              <span className="text-xs text-red-500">{errors.vehicle_id}</span>
            )}
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
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setErrors((prev) => ({ ...prev, start_time: "" }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <Label>Departure Time </Label>
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value);
                setErrors((prev) => ({ ...prev, start_time: "" }));
              }}
            />
          </div>
        </div>
        {errors.start_time && (
          <span className="text-xs text-red-500">{errors.start_time}</span>
        )}

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

        <Button className="mt-4" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating Trip..." : "Create Trip"}
        </Button>
      </CardBody>
    </Card>
  );
}
