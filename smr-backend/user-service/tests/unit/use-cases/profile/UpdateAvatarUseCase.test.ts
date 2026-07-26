import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateAvatarUseCase } from "#/application/use-case/profile/UpdateAvatarUseCase";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { mockStorageService } from "&#/mocks/MockStorageService";
import { MockLogger } from "&#/mocks/MockLogger";
import { createMockUserData } from "&#/fixtures/dto/UserData";
import { ApplicationError } from "@sharemyride/shared";

describe("UpdateAvatarUseCase", () => {
  const mockLogger = new MockLogger();
  const useCase = new UpdateAvatarUseCase(
    mockUserRepository,
    mockStorageService,
    mockLogger,
  );
  const mockUserId = "user-123";
  const newProfileImagePath = "user-files/user-123/avatar-1700.png";
  const publicCdnUrl = "https://cdn.example.com/user-files/user-123/avatar-1700.png";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully update user avatar and delete old storage file", async () => {
    const existingUser = createMockUserData({
      userId: mockUserId,
      profileImage: "user-files/user-123/avatar-old.png",
    });

    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(existingUser);
    vi.mocked(mockStorageService.getPublicURL).mockResolvedValue(publicCdnUrl);
    vi.mocked(mockUserRepository.updateById).mockResolvedValue({
      ...existingUser,
      profileImage: newProfileImagePath,
    });
    vi.mocked(mockStorageService.deleteFile).mockResolvedValue(undefined);

    const result = await useCase.execute({
      userId: mockUserId,
      profileImage: newProfileImagePath,
    });

    expect(mockUserRepository.findByCustomId).toHaveBeenCalledWith(mockUserId);
    expect(mockStorageService.getPublicURL).toHaveBeenCalledWith(newProfileImagePath);
    expect(mockUserRepository.updateById).toHaveBeenCalledWith(
      existingUser.id,
      expect.objectContaining({
        profileImage: publicCdnUrl,
        updatedAt: expect.any(Date),
      }),
    );
    expect(mockStorageService.deleteFile).toHaveBeenCalledWith("user-files/user-123/avatar-old.png");
    expect(result).toEqual({
      profileImage: publicCdnUrl,
    });
  });

  it("should log warning and succeed if storage deletion of old avatar fails", async () => {
    const existingUser = createMockUserData({
      userId: mockUserId,
      profileImage: "user-files/user-123/avatar-old.png",
    });

    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(existingUser);
    vi.mocked(mockStorageService.getPublicURL).mockResolvedValue(publicCdnUrl);
    vi.mocked(mockUserRepository.updateById).mockResolvedValue({
      ...existingUser,
      profileImage: newProfileImagePath,
    });
    vi.mocked(mockStorageService.deleteFile).mockRejectedValue(new Error("S3 Delete Failure"));

    const result = await useCase.execute({
      userId: mockUserId,
      profileImage: newProfileImagePath,
    });

    expect(mockUserRepository.updateById).toHaveBeenCalled();
    expect(mockStorageService.deleteFile).toHaveBeenCalledWith("user-files/user-123/avatar-old.png");
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "Failed to delete previous avatar from storage",
      expect.objectContaining({
        userId: mockUserId,
        oldProfileImage: "user-files/user-123/avatar-old.png",
      }),
    );
    expect(result).toEqual({
      profileImage: publicCdnUrl,
    });
  });

  it("should throw NotFound ApplicationError if user does not exist", async () => {
    vi.mocked(mockUserRepository.findByCustomId).mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: mockUserId,
        profileImage: newProfileImagePath,
      }),
    ).rejects.toThrow();
  });
});
