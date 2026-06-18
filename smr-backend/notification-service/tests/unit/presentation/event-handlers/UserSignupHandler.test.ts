import { describe, it, expect } from "vitest";
import { UserSignupHandler } from "#/presentation/event-handlers/UserSignupHandler";
import { MockSendSignupVerificationMailUseCase } from "&#/mocks/MockSendSignupVerificationMailUseCase";
import { mockUserSignUpEvent } from "&#/fixtures/events/DomainEvents";

describe("UserSignupHandler", () => {
  it("should map event payload and invoke use case", async () => {
    const useCase = new MockSendSignupVerificationMailUseCase();
    const handler = new UserSignupHandler(useCase);

    await handler.handle(mockUserSignUpEvent);

    expect(useCase.execute).toHaveBeenCalledWith({
      userName: "John Doe",
      emailId: "test@example.com",
      userId: "u123",
      verificationToken: "token123",
    });
  });
});
