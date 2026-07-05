import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChangePasswordUseCase } from "#/application/use-case/auth/ChangePasswordUseCase";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { mockTokenService } from "&#/mocks/MockTokenService";
import { mockHashingService } from "&#/mocks/MockHashingService";
import { mockEventBus } from "&#/mocks/MockEventBus";
import { createMockUserData } from "&#/fixtures/dto/UserData";
import { VerificationToken } from "#/domain/ValueObjects/VerificationToken";
import { TokenType } from "@smr/shared";

describe("ChangePasswordUseCase", () => {
  const useCase = new ChangePasswordUseCase(
    mockUserRepository,
    mockTokenService,
    mockHashingService,
    mockEventBus,
  );

  const mockEmail = "test@test.com";
  const mockUserId = "user-123";
  const mockToken = "valid-reset-token";

  const tokenPayload = {
    userId: mockUserId,
    emailId: mockEmail,
    tokenType: TokenType.PASSWORD_RESET_TOKEN,
  };

  const mockUser = createMockUserData({
    userId: mockUserId,
    emailId: mockEmail,
    verificationToken: new VerificationToken(
      mockToken,
      new Date(Date.now() + 3600000),
    ),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully change password, clear verification token, and publish event on success", async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
    vi.mocked(mockTokenService.verifyToken).mockReturnValue(tokenPayload);
    vi.mocked(mockHashingService.createHash).mockReturnValue("hashed-password");
    vi.mocked(mockUserRepository.updateByCustomId).mockResolvedValue(mockUser);

    await useCase.execute({
      emailId: mockEmail,
      password: "NewPassword123!",
      confimPassword: "NewPassword123!",
      token: mockToken,
    });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
    expect(mockTokenService.verifyToken).toHaveBeenCalledWith(mockToken);
    expect(mockHashingService.createHash).toHaveBeenCalledWith("NewPassword123!");
    expect(mockUserRepository.updateByCustomId).toHaveBeenCalledWith(
      mockUserId,
      expect.objectContaining({
        passwordHash: "hashed-password",
        verificationToken: undefined,
      }),
    );
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "auth.user.change_password.changed",
      }),
    );
  });

  it("should throw error if passwords do not match", async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
    vi.mocked(mockTokenService.verifyToken).mockReturnValue(tokenPayload);

    await expect(
      useCase.execute({
        emailId: mockEmail,
        password: "NewPassword123!",
        confimPassword: "DifferentPassword123!",
        token: mockToken,
      }),
    ).rejects.toThrow();
  });

  it("should throw error if token is expired", async () => {
    const expiredUser = createMockUserData({
      userId: mockUserId,
      emailId: mockEmail,
      verificationToken: new VerificationToken(
        mockToken,
        new Date(Date.now() - 1000),
      ),
    });
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(expiredUser);

    await expect(
      useCase.execute({
        emailId: mockEmail,
        password: "NewPassword123!",
        confimPassword: "NewPassword123!",
        token: mockToken,
      }),
    ).rejects.toThrow();
  });
});
