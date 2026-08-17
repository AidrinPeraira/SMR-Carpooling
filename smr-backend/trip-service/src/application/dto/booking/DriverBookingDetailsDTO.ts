import { BookingStatus, Route, TripStop } from "@sharemyride/shared";

export interface DriverGetAllBookingsQueryDTO {
  bookingStatus?: BookingStatus;
  page?: number;
  limit?: number;
}

export interface DriverGetAllBookingsResultDTO {
  bookingId: string;

  passngerName: string;

  tripDate: Date;
  tripVehicle: string;

  pickupPointName: string;
  pickupPointAddress: string;

  dropOffPointName: string;
  dropOffPointAddress: string;

  bookingDistance: number;
  seatCount: number;

  status: BookingStatus;
  totalPrice: number;
}

export interface GetBookingDetailsResultDTO {
  bookingId: string;

  passngerName: string;

  tripDate: Date;
  tripVehicle: string;
  tripRoute: Route;

  pickupPoint: TripStop;
  dropOffPoint: TripStop;
  bookingDistance: number;
  seatCount: number;

  status: BookingStatus;
  totalPrice: number;
}
