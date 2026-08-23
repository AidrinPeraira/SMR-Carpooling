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

export interface BookingPaymentSuccessEventPayload {
  passengerId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  bookingId: string;
  paymentKey: string;
}

export type BookingPaymentSuccessEvent =
  DomainEvent<BookingPaymentSuccessEventPayload>;

export interface BookingPaymentFailureEventPayload {
  passengerId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  bookingId: string;
  paymentKey: string;
}

export type BookingPaymentFailureEvent =
  DomainEvent<BookingPaymentFailureEventPayload>;

export interface PassengerCancelBookingEventPayload {
  tripId: string;
  bookingId: string;
  passengerId: string;
  passengerName: string;
  bookingStart: string;
  bookingStop: string;
  amount: string;
}

export type PassengerCancelBookingEvent =
  DomainEvent<PassengerCancelBookingEventPayload>;
