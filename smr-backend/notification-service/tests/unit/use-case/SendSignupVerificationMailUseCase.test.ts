import { describe, it, expect } from "vitest";
import { SendSignupVerificationMailUseCase } from "#/application/use-case/SendSignupVerificationMailUseCase";
import { AppConfig } from "#/application.config";
import { MockMailService } from "&#/mocks/MockMailService";

describe("SendSignupVerificationMailUseCase", () => {
  it("should format notification correctly and call mail service", async () => {
    const mailService = new MockMailService();
    const useCase = new SendSignupVerificationMailUseCase(mailService);

    const testData = {
      userName: "Jane Smith",
      emailId: "jane@example.com",
      userId: "u2",
      verificationToken: "token456",
    };

    await useCase.execute(testData);

    expect(mailService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient: "jane@example.com",
        subject: "Welcome to ShareMyRide, Jane Smith",
        body: expect.stringContaining(
          `${AppConfig.FRONTEND_URL}/auth/signup/verify?token=token456`,
        ),
      }),
    );
  });
});
