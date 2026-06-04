import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginUserUseCase } from "#/application/use-case/LoginUserUseCase";
import { LoginUserRequestDTO } from "#/application/dto/auth/LoginUserRequestDTO";
import {
  AccountStatus,
  ApplicationError,
  HttpStatusCodes,
  UserErrorMessage,
  ErrorCode,
} from "@smr/shared";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { mockHashingService } from "&#/mocks/MockHashingService";
import { mockTokenService } from "&#/mocks/MockTokenService";
import { mockSessionRepository } from "&#/mocks/MockSessionRepository";
import { createMockUserData } from "&#/fixtures/dto/UserData";

describe("LoginUserUseCase", () => {
  const loginUserUseCase = new LoginUserUseCase(
    mockUserRepository,
    mockHashingService,
    mockTokenService,
    mockSessionRepository,
  );

  const loginRequest: LoginUserRequestDTO = {
    emailId: "sample@mail.com",
    password: "Password123!",
  };

  const mockUser = createMockUserData({
    passwordHash: "hashed_Password123!",
    accountStatus: AccountStatus.VERIFIIED,
    emailVerified: true,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully login a user and return tokens", async () => {
    // Arrange
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
    vi.mocked(mockHashingService.compareHash).mockReturnValue(true);
    vi.mocked(mockTokenService.generateAccessToken).mockReturnValue(
      "access-token",
    );
    vi.mocked(mockTokenService.generateRefreshToken).mockReturnValue(
      "refresh-token",
    );
    vi.mocked(mockSessionRepository.getSession).mockResolvedValue(null);

    // Act
    const result = await loginUserUseCase.execute(loginRequest);

    // Assert
    expect(result.accessToken).toBe("access-token");
    expect(result.refreshToken).toBe("refresh-token");

    expect(mockSessionRepository.updateSession).toHaveBeenCalledWith(
      `auth:session:${mockUser.userId}`,
      {
        userId: mockUser.userId,
        activeRefreshTokens: ["refresh-token"],
      },
    );
  });

  it("should append new refresh token to existing session", async () => {
    // Arrange
    const existingSession = {
      userId: mockUser.userId,
      activeRefreshTokens: ["old-refresh-token"],
    };
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
    vi.mocked(mockHashingService.compareHash).mockReturnValue(true);
    vi.mocked(mockTokenService.generateRefreshToken).mockReturnValue(
      "new-refresh-token",
    );
    vi.mocked(mockSessionRepository.getSession).mockResolvedValue(
      existingSession,
    );

    // Act
    await loginUserUseCase.execute(loginRequest);

    // Assert
    expect(mockSessionRepository.updateSession).toHaveBeenCalledWith(
      `auth:session:${mockUser.userId}`,
      {
        userId: mockUser.userId,
        activeRefreshTokens: ["old-refresh-token", "new-refresh-token"],
      },
    );
  });

  it("should throw NotFound error if user does not exist", async () => {
    // Arrange
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

    // Act & Assert
    await expect(loginUserUseCase.execute(loginRequest)).rejects.toThrow(
      new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        { emailId: loginRequest.emailId },
      ),
    );
  });

  it("should throw Unauthorized error for invalid password", async () => {
    // Arrange
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
    vi.mocked(mockHashingService.compareHash).mockReturnValue(false);

    // Act & Assert
    await expect(loginUserUseCase.execute(loginRequest)).rejects.toThrow(
      new ApplicationError(
        UserErrorMessage.INVALID_CREDENTIALS,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        { emailId: loginRequest.emailId },
      ),
    );
  });

  it("should throw Unauthorized error for unverified email", async () => {
    // Arrange
    const unverifiedUser = { ...mockUser, emailVerified: false };
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(unverifiedUser);
    vi.mocked(mockHashingService.compareHash).mockReturnValue(true);

    // Act & Assert
    await expect(loginUserUseCase.execute(loginRequest)).rejects.toThrow(
      new ApplicationError(
        UserErrorMessage.UNVERIFIED_EMAIL,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        { emailId: loginRequest.emailId },
      ),
    );
  });

  it("should throw Unauthorized error for suspended account", async () => {
    // Arrange
    const suspendedUser = {
      ...mockUser,
      accountStatus: AccountStatus.SUSPENDED,
    };
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(suspendedUser);
    vi.mocked(mockHashingService.compareHash).mockReturnValue(true);

    // Act & Assert
    await expect(loginUserUseCase.execute(loginRequest)).rejects.toThrow(
      new ApplicationError(
        UserErrorMessage.ACCOUNT_SUSPENDED,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        { emailId: loginRequest.emailId },
      ),
    );
  });
});
