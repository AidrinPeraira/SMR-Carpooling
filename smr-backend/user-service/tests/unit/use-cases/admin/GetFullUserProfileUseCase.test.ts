import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetFullUserProfileUseCase } from "#/application/use-case/admin/users/GetFullUserProfileUseCase";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { createMockUserData } from "&#/fixtures/dto/UserData";
import { AccountStatus, UserRole } from "@smr/shared";

describe("GetFullUserProfileUseCase", () => {
  const useCase = new GetFullUserProfileUseCase(mockUserRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve a user profile matching the given userId and map to GetFullUserProfileResponseDTO", async () => {
    const userId = "user-123";
    const mockUser = createMockUserData({
      userId,
      firstName: "Alice",
      lastName: "Smith",
      emailId: "alice.smith@example.com",
      userRole: UserRole.PASSENGER,
      accountStatus: AccountStatus.ACTIVE,
      phoneNumber: "1234567890",
      isDriver: false,
      emailVerified: true,
      createdAt: new Date(),
    });

    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(mockUser);

    const result = await useCase.execute(userId);

    expect(mockUserRepository.findByCustomId).toHaveBeenCalledWith(userId);
    expect(result).toEqual({
      userId: mockUser.userId,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      emailId: mockUser.emailId,
      userRole: mockUser.userRole,
      accountStatus: mockUser.accountStatus,
      emailVerified: mockUser.emailVerified,
      isDriver: mockUser.isDriver,
      phoneNumber: mockUser.phoneNumber,
      profileImage: mockUser.profileImage,
      createdAt: mockUser.createdAt,
    });
  });

  it("should throw an ApplicationError if userId is empty", async () => {
    await expect(useCase.execute("")).rejects.toThrowError();
  });

  it("should throw an ApplicationError if user is not found in the repository", async () => {
    const userId = "non-existent-user";
    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(null);

    await expect(useCase.execute(userId)).rejects.toThrowError();
  });
});
