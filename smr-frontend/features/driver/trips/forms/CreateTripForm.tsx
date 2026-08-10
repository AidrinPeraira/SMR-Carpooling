import { PreferencesSelectionCard } from "@/features/driver/trips/components/PreferencesSelectionCard";
import { StopSelectionCard } from "@/features/driver/trips/components/StopSelectionCard";
import { TimeSelectionCard } from "@/features/driver/trips/components/TimeSelectionCard";
import { VehicleSelectionCard } from "@/features/driver/trips/components/VehicleSelectionCard";

export function CreateTripForm() {
  return (
    <form>
      <StopSelectionCard />
      <VehicleSelectionCard />
      <TimeSelectionCard />
      <PreferencesSelectionCard />
    </form>
  );
}
