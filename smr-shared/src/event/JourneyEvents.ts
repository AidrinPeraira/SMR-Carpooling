import { DomainEvent } from "./DomainEvent";

export interface JourneyStartedEventPayload {
  journey_id: string;
  passenger_ids: string[];
  driver_id: string;
}

export interface JourneyDriverArrivedEventPayload {
  journey_id: string;
  driver_id: string;
  passenger_id: string;
  stop_type: string;
}

export interface JourneyPassengerPickedUpEventPayload {
  journey_id: string;
  driver_id: string;
  passenger_id: string;
}

export interface JourneyPassengerDroppedOffEventPayload {
  journey_id: string;
  driver_id: string;
  passenger_id: string;
  booking_id: string;
  amount: number;
}

export interface JourneyPassengerNoShowEventPayload {
  journey_id: string;
  driver_id: string;
  passenger_id: string;
  booking_id: string;
}

export interface JourneyCompletedEventPayload {
  journey_id: string;
  driver_id: string;
  passenger_ids: string[];
}

export type JourneyStartedEvent = DomainEvent<JourneyStartedEventPayload>;
export type JourneyDriverArrivedEvent = DomainEvent<JourneyDriverArrivedEventPayload>;
export type JourneyPassengerPickedUpEvent = DomainEvent<JourneyPassengerPickedUpEventPayload>;
export type JourneyPassengerDroppedOffEvent = DomainEvent<JourneyPassengerDroppedOffEventPayload>;
export type JourneyPassengerNoShowEvent = DomainEvent<JourneyPassengerNoShowEventPayload>;
export type JourneyCompletedEvent = DomainEvent<JourneyCompletedEventPayload>;
