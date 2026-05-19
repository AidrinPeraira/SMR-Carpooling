import { EventName } from "./EventEnums";

export interface DomainEvent<payloadType> {
  eventName: EventName;
  payload: payloadType;
  timestamp: Date;
}
