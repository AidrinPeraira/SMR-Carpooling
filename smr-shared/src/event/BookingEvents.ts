import { TripStop } from "../types";
import { DomainEvent } from "./DomainEvent";

export interface NewBookingEventPayload {
  bookingId: string;

  passengerId: string;
  passengerName: string;
  passengerEmail: string;

  passengerOrigin: TripStop;
  passengerDestination: TripStop;

  seatCount: number;
  bookingAmount: number;

  driverId: string;
  driverName: string;
  driverEmail: string;

  tripId: string;
  tripDate: Date;
}

export type NewBookingEvent = DomainEvent<NewBookingEventPayload>;
