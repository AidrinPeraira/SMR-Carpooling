import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { vi } from "vitest";

const StorageService = vi.fn(
  class implements IStorageService {
    generateSignedUploadURL = vi.fn();
    generateSignedDownloadURL = vi.fn();
    getPublicURL = vi.fn();
    moveFile = vi.fn();
    deleteFile = vi.fn();
  },
);

export const mockStorageService = new StorageService();
