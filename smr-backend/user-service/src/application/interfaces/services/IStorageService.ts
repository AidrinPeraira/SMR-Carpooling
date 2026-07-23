/**
 * This interface defines the methods needed for
 * file upload and storage service like S3
 *
 * This contract should work for any key value store that stores objects.
 */
export interface IStorageService {
  generateSignedUploadURL(filePath: string, ttl: number): Promise<string>;

  generateSignedDownloadURL(filePath: string, ttl: number): Promise<string>;

  deleteFile(filePath: string): Promise<void>;
}
