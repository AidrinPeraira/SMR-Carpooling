import { describe, it, expect, vi } from "vitest";
import { PasswordChangeRequestHandler } from "#/presentation/event-handlers/PasswordChangeRequestHandler";
import { MockLogger } from "&#/mocks/MockLogger";
import { PasswordChangeRequestEvent, EventName } from "@sharemyride/shared";

describe("PasswordChangeRequestHandler", () => {
  it("should map event payload and invoke use case", async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };
    const mockLogger = new MockLogger();
    const handler = new PasswordChangeRequestHandler(mockLogger, mockUseCase as any);

    const event: PasswordChangeRequestEvent = {
      eventName: EventName.AUTH_USER_CHANGE_PASSWORD_REQUEST,
      timestamp: new Date(),
      payload: {
        userId: "user123",
        emailId: "user@example.com",
        firstName: "Jane",
        lastName: "Doe",
        token: "pwdToken123",
      },
    };

    await handler.handle(event);

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      userName: "Jane Doe",
      emailId: "user@example.com",
      userId: "user123",
      token: "pwdToken123",
    });
  });
});
