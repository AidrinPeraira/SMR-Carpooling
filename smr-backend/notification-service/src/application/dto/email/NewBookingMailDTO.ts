import { TripStop } from "@sharemyride/shared";

export interface NewBookingMailDTO {
  bookingId: string;
  passengerName: string;
  passengerEmail: string;
  passengerOrigin: TripStop;
  passengerDestination: TripStop;
  seatCount: number;
  bookingAmount: number;
  driverName: string;
  driverEmail: string;
  tripId: string;
  tripDate: Date;
}
