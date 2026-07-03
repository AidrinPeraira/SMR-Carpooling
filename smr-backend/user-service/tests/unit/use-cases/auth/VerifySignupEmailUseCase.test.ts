import { describe, it, expect, vi, beforeEach } from "vitest";
import { VerifySignupEmailUseCase } from "#/application/use-case/auth/VerifySignupEmailUseCase";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { mockTokenService } from "&#/mocks/MockTokenService";
import { createMockUserData } from "&#/fixtures/dto/UserData";
import { VerificationToken } from "#/domain/ValueObjects/VerificationToken";
import { TokenType } from "@smr/shared";

describe("VerifySignupEmailUseCase", () => {
  const useCase = new VerifySignupEmailUseCase(
    mockUserRepository,
    mockTokenService,
  );

  const mockToken = "valid-verification-token";
  const mockUserId = "user-123";
  const mockEmail = "test@test.com";

  const tokenPayload = {
    userId: mockUserId,
    emailId: mockEmail,
    tokenType: TokenType.EMAIL_VERIFICATION_TOKEN,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
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

  it("should successfully verify email and return tokens", async () => {
    vi.mocked(mockTokenService.verifyToken).mockReturnValue(tokenPayload);
    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(mockUser);
    vi.mocked(mockTokenService.generateAccessToken).mockReturnValue(
      "access-token",
    );
    vi.mocked(mockTokenService.generateRefreshToken).mockReturnValue(
      "refresh-token",
    );

    const result = await useCase.execute({ verificationToken: mockToken });

    expect(result.accessToken).toBe("access-token");
    expect(mockUserRepository.updateByCustomId).toHaveBeenCalledWith(
      mockUserId,
      expect.objectContaining({
        emailVerified: true,
      }),
    );
  });

  it("should throw error if token does not match user record", async () => {
    vi.mocked(mockTokenService.verifyToken).mockReturnValue(tokenPayload);
    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(mockUser);

    await expect(
      useCase.execute({ verificationToken: "wrong-token" }),
    ).rejects.toThrow();
  });

  it("should throw error if token is expired in user record", async () => {
    const expiredUser = createMockUserData({
      userId: mockUserId,
      verificationToken: new VerificationToken(
        mockToken,
        new Date(Date.now() - 1000),
      ),
    });
    vi.mocked(mockTokenService.verifyToken).mockReturnValue(tokenPayload);
    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(expiredUser);

    await expect(
      useCase.execute({ verificationToken: mockToken }),
    ).rejects.toThrow();
  });
});
