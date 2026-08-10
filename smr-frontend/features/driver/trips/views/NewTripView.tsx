import { CreateTripForm } from "@/features/driver/trips/forms/CreateTripForm";
import { MapContainer } from "@/features/map/components/MapContainer";

export function NewTripView() {
  return (
    <div className="w-full text-fg-primary mt-10 flex">
      <div className="w-1/2">
        <CreateTripForm />
      </div>
      <div className="w-1/2 m-2 p-2  h-[400px] border">
        <MapContainer className="" />
      </div>
    </div>
  );
}
