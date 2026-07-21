import { DomainEvent, EventName } from "@sharemyride/shared";

export const mockEvent: DomainEvent<unknown> = {
  eventName: "test.event" as EventName,
  payload: { message: "Hello World!" },
  timestamp: new Date(),
};
