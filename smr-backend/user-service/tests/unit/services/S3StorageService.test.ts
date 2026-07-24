import { describe, it, expect, vi, beforeEach } from "vitest";
import { S3StorageService } from "#/infrastructure/services/S3StorageService";
import { ImageFileTypes } from "@sharemyride/shared";

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: vi.fn(function () {
      return {
        send: mockSend,
      };
    }),
    PutObjectCommand: vi.fn(),
    GetObjectCommand: vi.fn(),
    DeleteObjectCommand: vi.fn(),
  };
});

vi.mock("@aws-sdk/s3-request-presigner", () => {
  return {
    getSignedUrl: vi.fn(),
  };
});

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

describe("S3StorageService", () => {
  let service: S3StorageService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new S3StorageService();
  });

  it("should generate signed upload URL successfully", async () => {
    vi.mocked(getSignedUrl).mockResolvedValue("https://r2.example.com/upload-signed-url");

    const result = await service.generateSignedUploadURL(
      "user-files/user-123/avatar.png",
      ImageFileTypes.PNG,
      300,
    );

    expect(getSignedUrl).toHaveBeenCalled();
    expect(result).toBe("https://r2.example.com/upload-signed-url");
  });

  it("should generate signed download URL successfully", async () => {
    vi.mocked(getSignedUrl).mockResolvedValue("https://r2.example.com/download-signed-url");

    const result = await service.generateSignedDownloadURL(
      "user-files/user-123/avatar.png",
      300,
    );

    expect(getSignedUrl).toHaveBeenCalled();
    expect(result).toBe("https://r2.example.com/download-signed-url");
  });

  it("should format public CDN URL correctly", async () => {
    const result = await service.getPublicURL("user-files/user-123/avatar.png");
    expect(result).toContain("/user-files/user-123/avatar.png");
  });

  it("should delete file successfully", async () => {
    mockSend.mockResolvedValue({});

    await service.deleteFile("user-files/user-123/avatar.png");

    expect(mockSend).toHaveBeenCalled();
  });
});
