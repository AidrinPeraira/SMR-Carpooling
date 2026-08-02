import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetFileUploadUrlUseCase } from "#/application/use-case/GetFileUploadUrlUseCase";
import { mockStorageService } from "&#/mocks/MockStorageService";
import { ApplicationError, FileNames, ImageFileTypes } from "@sharemyride/shared";

describe("GetFileUploadUrlUseCase", () => {
  const useCase = new GetFileUploadUrlUseCase(mockStorageService);
  const mockUserId = "user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully generate presigned upload URL for driver license file", async () => {
    vi.mocked(mockStorageService.generateSignedUploadURL).mockResolvedValue(
      "https://storage.example.com/signed-upload-url-license",
    );

    const result = await useCase.execute({
      userId: mockUserId,
      fileName: FileNames.DRIVER_LICENSE,
      fileType: ImageFileTypes.JPG,
    });

    expect(mockStorageService.generateSignedUploadURL).toHaveBeenCalledWith(
      expect.stringMatching(
        new RegExp(`^temp/user-files/${mockUserId}/${FileNames.DRIVER_LICENSE}-\\d+\\.jpg$`),
      ),
      ImageFileTypes.JPG,
      expect.any(Number),
    );
    expect(result.url).toBe("https://storage.example.com/signed-upload-url-license");
    expect(result.expiresAt).toBeInstanceOf(Date);
  });

  it("should rethrow error if storage service fails", async () => {
    vi.mocked(mockStorageService.generateSignedUploadURL).mockRejectedValue(
      new ApplicationError(
        "Storage failure",
        500,
        "ERR_SYSTEM_INTERNAL_ERROR" as any,
        {},
      ),
    );

    await expect(
      useCase.execute({
        userId: mockUserId,
        fileName: FileNames.VEHICLE_REGISTRATION,
        fileType: ImageFileTypes.PNG,
      }),
    ).rejects.toThrow("Storage failure");
  });
});
