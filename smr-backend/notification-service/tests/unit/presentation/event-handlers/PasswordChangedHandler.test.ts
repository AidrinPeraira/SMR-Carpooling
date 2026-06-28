import { describe, it, expect, vi } from "vitest";
import { PasswordChangedHandler } from "#/presentation/event-handlers/PasswordChangedHandler";
import { MockLogger } from "&#/mocks/MockLogger";
import { PasswordChangedEvent, EventName } from "@smr/shared";

describe("PasswordChangedHandler", () => {
  it("should map event payload and invoke use case", async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };
    const mockLogger = new MockLogger();
    const handler = new PasswordChangedHandler(mockLogger, mockUseCase as any);

    const event: PasswordChangedEvent = {
      eventName: EventName.AUTH_USER_CHANGE_PASSWORD_CHANGED,
      timestamp: new Date(),
      payload: {
        userId: "user123",
        emailId: "user@example.com",
        firstName: "Jane",
        lastName: "Doe",
      },
    };

    await handler.handle(event);

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      userName: "Jane Doe",
      emailId: "user@example.com",
      userId: "user123",
    });
  });
});
