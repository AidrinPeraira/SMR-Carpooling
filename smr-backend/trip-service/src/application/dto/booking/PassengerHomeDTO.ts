import { BookingStatus, TripStop } from "@sharemyride/shared";

export interface PassengerBookingStatsResponseDTO {
  totalBookings: number;
  bookingsThisMonth: number;
}

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
