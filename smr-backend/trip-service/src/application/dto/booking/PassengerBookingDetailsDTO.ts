import { BookingStatus, Route, TripStop } from "@sharemyride/shared";

export interface PassengerGetAllBookingsQueryDTO {
  bookingStatus?: BookingStatus;
  page?: number;
  limit?: number;
}

export interface PassengerGetAllBookingsResultDTO {
  bookingId: string;

  driverName: string;

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

export interface GetPassengerBookingDetailsResultDTO {
  bookingId: string;

  driverName: string;

  tripDate: Date;
  tripVehicle: string;
  tirpVehicleImage: string;
  tripRoute: Route;

  pickupPoint: TripStop;
  dropOffPoint: TripStop;
  bookingDistance: number;
  seatCount: number;

  status: BookingStatus;
  totalPrice: number;
}
