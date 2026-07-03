import { describe, it, expect, vi, beforeEach } from "vitest";
import { RefreshTokenUseCase } from "#/application/use-case/auth/RefreshTokenUseCase";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { mockTokenService } from "&#/mocks/MockTokenService";
import { createMockUserData } from "&#/fixtures/dto/UserData";
import {
  AccountStatus,
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  TokenType,
  UserErrorMessage,
} from "@smr/shared";

describe("RefreshTokenUseCase", () => {
  const useCase = new RefreshTokenUseCase(mockUserRepository, mockTokenService);

  const mockRefreshToken = "valid-refresh-token";
  const mockUserId = "user-123";
  const mockEmail = "test@test.com";

  const tokenPayload = {
    user: {
      userId: mockUserId,
      userRole: "passenger",
      firstName: "Test",
      lastName: "User",
      emailId: mockEmail,
    },
    tokenType: TokenType.REFRESH_TOKEN,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const mockUser = createMockUserData({
    userId: mockUserId,
    emailId: mockEmail,
    accountStatus: AccountStatus.VERIFIIED,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully refresh tokens", async () => {
    vi.mocked(mockTokenService.verifyRefreshToken).mockReturnValue(tokenPayload);
    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(mockUser);
    vi.mocked(mockTokenService.generateAccessToken).mockReturnValue("new-access-token");
    vi.mocked(mockTokenService.generateRefreshToken).mockReturnValue("new-refresh-token");

    const result = await useCase.execute({ refreshToken: mockRefreshToken });

    expect(result.accessToken).toBe("new-access-token");
    expect(result.refreshToken).toBe("new-refresh-token");
    expect(mockUserRepository.findByCustomId).toHaveBeenCalledWith(mockUserId);
  });

  it("should throw NotFound error if user does not exist", async () => {
    vi.mocked(mockTokenService.verifyRefreshToken).mockReturnValue(tokenPayload);
    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(null);

    await expect(
      useCase.execute({ refreshToken: mockRefreshToken }),
    ).rejects.toThrow(
      new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
      ),
    );
  });

  it("should throw Forbidden error if user is blocked", async () => {
    const blockedUser = createMockUserData({
      userId: mockUserId,
      emailId: mockEmail,
      accountStatus: AccountStatus.BLOCKED,
    });

    vi.mocked(mockTokenService.verifyRefreshToken).mockReturnValue(tokenPayload);
    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(blockedUser);

    await expect(
      useCase.execute({ refreshToken: mockRefreshToken }),
    ).rejects.toThrow(
      new ApplicationError(
        UserErrorMessage.ACCOUNT_SUSPENDED,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
      ),
    );
  });
});
