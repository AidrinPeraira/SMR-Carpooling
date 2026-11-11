import { BookingStatus, TripStatus, TripStop } from "@sharemyride/shared";

export interface PassengerTodayTripResponseDTO {
  bookingId: string;
  driverName: string;
  tripId: string;
  tripStartTime: string;
  vehicleName: string;
  pickupPoint: TripStop;
  dropOffPoint: TripStop;
  seatCount: number;
  totalPrice: number;
  status: BookingStatus;
  tripStatus: TripStatus;
}
