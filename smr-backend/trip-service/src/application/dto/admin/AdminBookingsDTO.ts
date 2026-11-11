import { BookingStatus, QueryDTO, Route, TripStop } from "@sharemyride/shared";

export type AdminListAllBookingsQueryDTO =
  QueryDTO<AdminListAllBookingsResponseDTO>;

export interface AdminListAllBookingsResponseDTO {
  bookingId: string;
  passengerName: string;
  bookingOrigin: string;
  bookingDestination: string;
  status: BookingStatus;
  tripDate: Date;
}

export interface AdminBookingDetiailsResponseDTO {
  bookingId: string;

  tripId: string;
  tripDate: string;
  tripOrigin: TripStop;
  tripDestination: TripStop;
  tripRoute: Route;
  vehicelName: string;

  passengerId: string;
  passengerName: string;

  bookingStatus: BookingStatus;
  bookingOrigin: TripStop;
  bookingDestination: TripStop;
  distanceKm: number;
  seatCount: number;
  totalPrice: number;
}
