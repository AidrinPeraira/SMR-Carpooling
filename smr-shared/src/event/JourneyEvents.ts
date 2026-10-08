import { DomainEvent } from "./DomainEvent";

export interface JourneyStartedEventPayload {
  journey_id: string;
  passenger_ids: string[];
  driver_id: string;
}

export type JourneyStartedEvent = DomainEvent<JourneyStartedEventPayload>;
