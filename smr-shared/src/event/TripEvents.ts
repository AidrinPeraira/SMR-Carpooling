import { DomainEvent } from "./DomainEvent";

export interface DriverCancelTripEventPayload {
  tripId: string;
  cancelledBookings: {
    bookingId: string;
    passengerId: string;
    passengerName: string;
    passengerEmail: string;
  }[];
  driverId: string;
  dirverName: string;
  driverEmail: string;
}

export type DriverCancelTripEvent = DomainEvent<DriverCancelTripEventPayload>;

export interface NewTripEventPayload {
  tripId: string;
  driverId: string;
  driverName: string;
  driverEmail: string;
  tripDate: Date;
}

export type NewTripEvent = DomainEvent<NewTripEventPayload>;
