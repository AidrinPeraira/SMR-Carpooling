import { describe, it, expect } from "vitest";
import { UserSignupHandler } from "#/presentation/event-handlers/UserSignupHandler";
import { MockSendSignupVerificationMailUseCase } from "&#/mocks/MockSendSignupVerificationMailUseCase";
import { mockUserSignUpEvent } from "&#/fixtures/events/DomainEvents";
import { MockLogger } from "&#/mocks/MockLogger";

describe("UserSignupHandler", () => {
  it("should map event payload and invoke use case", async () => {
    const useCase = new MockSendSignupVerificationMailUseCase();
    const mockLogger = new MockLogger();
    const handler = new UserSignupHandler(mockLogger, useCase);

    await handler.handle(mockUserSignUpEvent);

    expect(useCase.execute).toHaveBeenCalledWith({
      userName: "John Doe",
      emailId: "test@example.com",
      userId: "u123",
      verificationToken: "token123",
    });
  });
});
