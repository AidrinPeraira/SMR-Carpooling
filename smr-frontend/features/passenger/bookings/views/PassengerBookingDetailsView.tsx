import { MapContainer } from "@/features/map/components/MapContainer";
import { BookingDetailsActionCard } from "@/features/passenger/bookings/components/BookingDetailsActionCard";
import { BookingDetailsTripCard } from "@/features/passenger/bookings/components/BookingDetailsTripCard";
import { BookingDetailsVehicelCard } from "@/features/passenger/bookings/components/BookingDetailsVehicelCard";

export function PassengerBookingDetailsView() {
  return (
    <div>
      <MapContainer />
      <BookingDetailsTripCard />
      <BookingDetailsVehicelCard />
      <BookingDetailsActionCard />
    </div>
  );
}
