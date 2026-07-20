import { DomainEvent, EventName, UserSignUpEvent } from "@sharemyride/shared";

export const mockUserSignUpEvent: UserSignUpEvent = {
  eventName: EventName.AUTH_USER_SIGNUP,
  timestamp: new Date("2026-01-01T00:00:00.000Z"),
  payload: {
    userId: "u123",
    emailId: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    token: "token123",
  },
};

export const mockGenericEvent: DomainEvent<unknown> = {
  eventName: "test.event" as EventName,
  timestamp: new Date("2026-01-01T00:00:00.000Z"),
  payload: { message: "Hello World" },
};
