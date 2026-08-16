import { describe, it, expect, vi, beforeEach } from "vitest";
import { SwitchUserRoleUseCase } from "#/application/use-case/profile/SwitchUserRoleUseCase";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { mockTokenService } from "&#/mocks/MockTokenService";
import { createMockUserData } from "&#/fixtures/dto/UserData";
import { ApplicationError, UserRole } from "@sharemyride/shared";

describe("SwitchUserRoleUseCase", () => {
  const useCase = new SwitchUserRoleUseCase(
    mockUserRepository,
    mockTokenService,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should switch role from DRIVER to PASSENGER and return updated LoginUserResultDTO", async () => {
    const mockDriver = createMockUserData({
      userId: "user-1",
      userRole: UserRole.DRIVER,
      isDriver: true,
    });

    const mockPassenger = {
      ...mockDriver,
      userRole: UserRole.PASSENGER,
    };

    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(mockDriver);
    vi.mocked(mockUserRepository.updateByCustomId).mockResolvedValue(mockPassenger);
    vi.mocked(mockTokenService.generateAccessToken).mockReturnValue("new-access-token");
    vi.mocked(mockTokenService.generateRefreshToken).mockReturnValue("new-refresh-token");

    const result = await useCase.execute("user-1");

    expect(mockUserRepository.findByCustomId).toHaveBeenCalledWith("user-1");
    expect(mockUserRepository.updateByCustomId).toHaveBeenCalledWith("user-1", {
      userRole: UserRole.PASSENGER,
    });
    expect(result.user.userRole).toBe(UserRole.PASSENGER);
    expect(result.accessToken).toBe("new-access-token");
    expect(result.refreshToken).toBe("new-refresh-token");
  });

  it("should switch role from PASSENGER to DRIVER", async () => {
    const mockPassenger = createMockUserData({
      userId: "user-1",
      userRole: UserRole.PASSENGER,
      isDriver: true,
    });

    const mockDriver = {
      ...mockPassenger,
      userRole: UserRole.DRIVER,
    };

    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(mockPassenger);
    vi.mocked(mockUserRepository.updateByCustomId).mockResolvedValue(mockDriver);
    vi.mocked(mockTokenService.generateAccessToken).mockReturnValue("new-access-token");
    vi.mocked(mockTokenService.generateRefreshToken).mockReturnValue("new-refresh-token");

    const result = await useCase.execute("user-1");

    expect(mockUserRepository.updateByCustomId).toHaveBeenCalledWith("user-1", {
      userRole: UserRole.DRIVER,
    });
    expect(result.user.userRole).toBe(UserRole.DRIVER);
  });

  it("should throw ApplicationError if user is not found", async () => {
    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(null);

    await expect(useCase.execute("non-existent")).rejects.toThrow(ApplicationError);
  });

  it("should throw ApplicationError if user is not registered as a driver", async () => {
    const mockUserNotDriver = createMockUserData({
      userId: "user-1",
      isDriver: false,
    });

    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(mockUserNotDriver);

    await expect(useCase.execute("user-1")).rejects.toThrow(ApplicationError);
  });
});
