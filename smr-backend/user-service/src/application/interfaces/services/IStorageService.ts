import { FileType } from "@sharemyride/shared";

/**
 * This interface defines the methods needed for
 * file upload and storage service like S3
 *
 * This contract should work for any key value store that stores objects.
 */
export interface IStorageService {
  generateSignedUploadURL(
    filePath: string,
    fileType: FileType,
    ttl: number,
    maxSizeBytes?: number,
  ): Promise<string>;

  generateSignedDownloadURL(filePath: string, ttl: number): Promise<string>;

  getPublicURL(filePath: string): Promise<string>;

  deleteFile(filePath: string): Promise<void>;
}

