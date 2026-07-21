import { describe, it, expect } from "vitest";
import { EventDispatcher } from "#/presentation/messaging/EventDispatcher";
import { EventName } from "@sharemyride/shared";
import { MockLogger } from "&#/mocks/MockLogger";
import { MockEventHandler } from "&#/mocks/MockEventHandler";
import { mockGenericEvent } from "&#/fixtures/events/DomainEvents";

describe("EventDispatcher", () => {
  it("should register and dispatch event to handler", async () => {
    const logger = new MockLogger();
    const dispatcher = new EventDispatcher(logger);
    const handler = new MockEventHandler();

    const testEvent = {
      ...mockGenericEvent,
      eventName: EventName.AUTH_USER_SIGNUP,
    };

    await dispatcher.register(EventName.AUTH_USER_SIGNUP, handler);
    await dispatcher.dispatch(testEvent);

    expect(handler.handle).toHaveBeenCalledWith(testEvent);
  });

  it("should warn if no handler registered for event", async () => {
    const logger = new MockLogger();
    const dispatcher = new EventDispatcher(logger);

    await dispatcher.dispatch(mockGenericEvent);
    expect(logger.warn).toHaveBeenCalled();
  });
});
