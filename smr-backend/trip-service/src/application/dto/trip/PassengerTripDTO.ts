import { BookingStatus, TripStop } from "@sharemyride/shared";

export interface PassengerTodayTripResponseDTO {
  bookingId: string;
  driverName: string;
  tripStartTime: string;
  vehicleName: string;
  pickupPoint: TripStop;
  dropOffPoint: TripStop;
  seatCount: number;
  totalPrice: number;
  status: BookingStatus;
}
