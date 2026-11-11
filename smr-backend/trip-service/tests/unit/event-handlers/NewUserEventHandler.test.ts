import { describe, it, expect, vi, beforeEach } from "vitest";
import { NewUserEventHandler } from "#/presentation/v1/event-handlers/NewUserEventHandler";
import { ICreateNewPassengerUseCase } from "#/application/interfaces/use-case/passenger/ICreateNewPassengerUseCase";
import { ILogger, UserSignUpEvent, EventName } from "@sharemyride/shared";

describe("NewUserEventHandler", () => {
  let mockLogger: ILogger;
  let mockCreateNewPassengerUseCase: ICreateNewPassengerUseCase;
  let handler: NewUserEventHandler;

  beforeEach(() => {
    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    } as unknown as ILogger;

    mockCreateNewPassengerUseCase = {
      execute: vi.fn(),
    };

    handler = new NewUserEventHandler(mockLogger, mockCreateNewPassengerUseCase);
  });

  it("should handle UserSignUpEvent and invoke CreateNewPassengerUseCase with event payload", async () => {
    // Arrange
    const signupEvent: UserSignUpEvent = {
      eventName: EventName.AUTH_USER_SIGNUP,
      timestamp: new Date(),
      payload: {
        userId: "user-789",
        firstName: "Alice",
        lastName: "Wonderland",
        emailId: "alice@example.com",
        token: "mock-token",
      },
    };

    vi.mocked(mockCreateNewPassengerUseCase.execute).mockResolvedValue();

    // Act
    await handler.handle(signupEvent);

    // Assert
    expect(mockLogger.info).toHaveBeenCalledWith(
      "Handling new user event: ",
      "user-789",
    );
    expect(mockCreateNewPassengerUseCase.execute).toHaveBeenCalledWith({
      userId: "user-789",
      firstName: "Alice",
      lastName: "Wonderland",
      emailId: "alice@example.com",
    });
  });
});
