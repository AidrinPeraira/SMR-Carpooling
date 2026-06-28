import { describe, it, expect, vi, beforeEach } from "vitest";
import { GeneratePasswordChangeTokenUseCase } from "#/application/use-case/GeneratePasswordChangeTokenUseCase";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { mockTokenService } from "&#/mocks/MockTokenService";
import { mockEventBus } from "&#/mocks/MockEventBus";
import { createMockUserData } from "&#/fixtures/dto/UserData";

describe("GeneratePasswordChangeTokenUseCase", () => {
  const useCase = new GeneratePasswordChangeTokenUseCase(
    mockUserRepository,
    mockTokenService,
    mockEventBus,
  );

  const mockEmail = "test@test.com";
  const mockUserId = "user-123";
  const mockUser = createMockUserData({
    userId: mockUserId,
    emailId: mockEmail,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate a new verification token and publish event on success", async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
    vi.mocked(mockTokenService.generateToken).mockReturnValue("mock-jwt-token");
    vi.mocked(mockUserRepository.updateByCustomId).mockResolvedValue(mockUser);

    await useCase.execute({ emailId: mockEmail });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
    expect(mockTokenService.generateToken).toHaveBeenCalled();
    expect(mockUserRepository.updateByCustomId).toHaveBeenCalledWith(
      mockUserId,
      expect.objectContaining({
        verificationToken: expect.objectContaining({
          value: "mock-jwt-token",
        }),
      }),
    );
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "auth.user.change_password.request",
        payload: expect.objectContaining({
          emailId: mockEmail,
          token: "mock-jwt-token",
        }),
      }),
    );
  });

  it("should throw error if user is not found", async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

    await expect(useCase.execute({ emailId: mockEmail })).rejects.toThrow();
  });
});
