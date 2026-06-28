import { describe, it, expect, vi, beforeEach } from "vitest";
import { GoogleAuthUseCase } from "#/application/use-case/GoggleAuthUseCase";
import {
  AccountStatus,
  ApplicationError,
  HttpStatusCodes,
  UserErrorMessage,
  ErrorCode,
} from "@smr/shared";
import { mockGoogleAuthService } from "&#/mocks/MockGoogleAuthService";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { mockUidGenerator } from "&#/mocks/MockUidGenerator";
import { mockTokenService } from "&#/mocks/MockTokenService";
import { createMockUserData } from "&#/fixtures/dto/UserData";

describe("GoogleAuthUseCase", () => {
  const googleAuthUseCase = new GoogleAuthUseCase(
    mockGoogleAuthService,
    mockUserRepository,
    mockUidGenerator,
    mockTokenService,
  );

  const mockGoogleProfile = {
    firstName: "John",
    lastName: "Doe",
    emailId: "johndoe@gmail.com",
    profileImage: "https://example.com/photo.jpg",
  };

  const mockUser = createMockUserData({
    firstName: "John",
    lastName: "Doe",
    emailId: "johndoe@gmail.com",
    profileImage: "https://example.com/photo.jpg",
    accountStatus: AccountStatus.VERIFIIED,
    emailVerified: true,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully login an existing user", async () => {
    // Arrange
    vi.mocked(mockGoogleAuthService.verifyToken).mockResolvedValue(
      mockGoogleProfile,
    );
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
    vi.mocked(mockTokenService.generateAccessToken).mockReturnValue(
      "access-token",
    );
    vi.mocked(mockTokenService.generateRefreshToken).mockReturnValue(
      "refresh-token",
    );

    // Act
    const result = await googleAuthUseCase.execute("valid-google-token");

    // Assert
    expect(result.user.emailId).toBe("johndoe@gmail.com");
    expect(result.accessToken).toBe("access-token");
    expect(result.refreshToken).toBe("refresh-token");
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it("should register a new user and login successfully", async () => {
    // Arrange
    vi.mocked(mockGoogleAuthService.verifyToken).mockResolvedValue(
      mockGoogleProfile,
    );
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(mockUidGenerator.generateRandomId).mockReturnValue("random-uuid");
    vi.mocked(mockUserRepository.save).mockResolvedValue({
      ...mockUser,
      userId: "random-uuid",
    });
    vi.mocked(mockTokenService.generateAccessToken).mockReturnValue(
      "access-token",
    );
    vi.mocked(mockTokenService.generateRefreshToken).mockReturnValue(
      "refresh-token",
    );

    // Act
    const result = await googleAuthUseCase.execute("valid-google-token");

    // Assert
    expect(result.user.userId).toBe("random-uuid");
    expect(result.accessToken).toBe("access-token");
    expect(result.refreshToken).toBe("refresh-token");
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "random-uuid",
        emailId: "johndoe@gmail.com",
        firstName: "John",
        lastName: "Doe",
        emailVerified: true,
        accountStatus: AccountStatus.VERIFIIED,
      }),
    );
  });

  it("should throw BadRequest error if Google profile lacks an emailId", async () => {
    // Arrange
    vi.mocked(mockGoogleAuthService.verifyToken).mockResolvedValue({
      firstName: "No",
      lastName: "Email",
      emailId: undefined,
    });

    // Act & Assert
    await expect(
      googleAuthUseCase.execute("invalid-google-token"),
    ).rejects.toThrow(
      new ApplicationError(
        UserErrorMessage.INVALID_CREDENTIALS,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        { reason: "Google profile does not contain a valid email address." },
      ),
    );
  });

  it("should throw Unauthorized error if user account is suspended", async () => {
    // Arrange
    const suspendedUser = {
      ...mockUser,
      accountStatus: AccountStatus.SUSPENDED,
    };
    vi.mocked(mockGoogleAuthService.verifyToken).mockResolvedValue(
      mockGoogleProfile,
    );
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(suspendedUser);

    // Act & Assert
    await expect(
      googleAuthUseCase.execute("valid-google-token"),
    ).rejects.toThrow(
      new ApplicationError(
        UserErrorMessage.ACCOUNT_SUSPENDED,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        { emailId: suspendedUser.emailId },
      ),
    );
  });
});
