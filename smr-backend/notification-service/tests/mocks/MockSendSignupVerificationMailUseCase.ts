import { ISendSignupVerificationMailUseCase } from "#/application/interfaces/use-case/auth/ISendSignupVerificationMailUseCase";
import { vi } from "vitest";

export const MockSendSignupVerificationMailUseCase = vi.fn(
  class implements ISendSignupVerificationMailUseCase {
    execute = vi.fn();
  },
);
