import { DomainEvent, EventName } from "@smr/shared";

export const mockEvent: DomainEvent<unknown> = {
  eventName: "test.event" as EventName,
  payload: { message: "Hello World!" },
  timestamp: new Date(),
};
