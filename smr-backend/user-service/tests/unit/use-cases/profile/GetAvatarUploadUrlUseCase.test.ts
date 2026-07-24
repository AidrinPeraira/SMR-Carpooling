import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetAvatarUploadUrlUseCase } from "#/application/use-case/profile/GetAvatarUploadUrlUseCase";
import { mockStorageService } from "&#/mocks/MockStorageService";
import { ApplicationError, ImageFileTypes } from "@sharemyride/shared";

describe("GetAvatarUploadUrlUseCase", () => {
  const useCase = new GetAvatarUploadUrlUseCase(mockStorageService);
  const mockUserId = "user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully generate presigned upload URL for JPG image", async () => {
    vi.mocked(mockStorageService.generateSignedUploadURL).mockResolvedValue(
      "https://storage.example.com/signed-upload-url",
    );

    const result = await useCase.execute({
      userId: mockUserId,
      fileType: ImageFileTypes.JPG,
    });

    expect(mockStorageService.generateSignedUploadURL).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`^user-files/${mockUserId}/avatar-\\d+\\.jpg$`)),
      ImageFileTypes.JPG,
      expect.any(Number),
      expect.any(Number),
    );
    expect(result.url).toBe("https://storage.example.com/signed-upload-url");
    expect(result.expiresAt).toBeInstanceOf(Date);
  });

  it("should successfully generate presigned upload URL for PNG image", async () => {
    vi.mocked(mockStorageService.generateSignedUploadURL).mockResolvedValue(
      "https://storage.example.com/signed-upload-url-png",
    );

    const result = await useCase.execute({
      userId: mockUserId,
      fileType: ImageFileTypes.PNG,
    });

    expect(mockStorageService.generateSignedUploadURL).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`^user-files/${mockUserId}/avatar-\\d+\\.png$`)),
      ImageFileTypes.PNG,
      expect.any(Number),
      expect.any(Number),
    );
    expect(result.url).toBe("https://storage.example.com/signed-upload-url-png");
  });

  it("should rethrow ApplicationError if storage service fails", async () => {
    vi.mocked(mockStorageService.generateSignedUploadURL).mockRejectedValue(
      new ApplicationError("Storage failure", 500, "ERR_SYSTEM_INTERNAL_ERROR" as any),
    );

    await expect(
      useCase.execute({
        userId: mockUserId,
        fileType: ImageFileTypes.WEBP,
      }),
    ).rejects.toThrow("Storage failure");
  });
});
