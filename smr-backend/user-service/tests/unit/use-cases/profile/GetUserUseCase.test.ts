import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetUserUseCase } from "#/application/use-case/profile/GetUserUseCase";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { createMockUserData } from "&#/fixtures/dto/UserData";
import { GenericErrorMessage, UserRole } from "@smr/shared";

describe("GetUserUseCase", () => {
  const useCase = new GetUserUseCase(mockUserRepository);
  const mockUserId = "user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully retrieve and return the user profile", async () => {
    const mockUser = createMockUserData({
      userId: mockUserId,
      firstName: "Jane",
      lastName: "Doe",
      emailId: "jane.doe@example.com",
      userRole: UserRole.PASSENGER,
    });

    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(mockUser);

    const result = await useCase.execute(mockUserId);

    expect(mockUserRepository.findByCustomId).toHaveBeenCalledWith(mockUserId);
    expect(result).toEqual({
      user: {
        userId: mockUser.userId,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        emailId: mockUser.emailId,
        userRole: mockUser.userRole,
        profileImage: mockUser.profileImage,
      },
    });
  });

  it("should throw a BadRequest error if userId is empty", async () => {
    await expect(useCase.execute("")).rejects.toThrow(
      GenericErrorMessage.BAD_REQUEST,
    );
  });

  it("should throw a NotFound error if user does not exist", async () => {
    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(null);

    await expect(useCase.execute(mockUserId)).rejects.toThrow();
  });
});
