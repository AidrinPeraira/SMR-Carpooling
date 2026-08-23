import { DomainEvent } from "./DomainEvent";

export interface DriverCancelTripEventPayload {
  tripId: string;
  cancelledBookings: {
    bookingId: string;
    passengerId: string;
    passengerName: string;
  }[];
  driverId: string;
  dirverName: string;
}

export type DriverCancelTripEvent = DomainEvent<DriverCancelTripEventPayload>;
