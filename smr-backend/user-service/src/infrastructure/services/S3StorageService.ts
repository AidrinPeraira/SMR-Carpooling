import { IStorageService } from "#/application/interfaces/services/IStorageService";
import {
  ApplicationError,
  ErrorCode,
  FileType,
  GenericErrorMessage,
  HttpStatusCodes,
} from "@sharemyride/shared";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { AppConfig } from "#/application.config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: "auto",
  endpoint: AppConfig.S3_API_URL,
  credentials: {
    accessKeyId: AppConfig.S3_ACCESS_ID,
    secretAccessKey: AppConfig.S3_SECRET_KEY,
  },
});

/**
 * THis is the implemntation for the storage service usin S3.
 * Currently it uses the aws-sdk for s3.
 * The service provider is but S3 compatible cloudflare R2
 */
export class S3StorageService implements IStorageService {
  private readonly client: S3Client = client;
  private readonly bucketName: string = AppConfig.S3_BUCKET_NAME;
  private readonly publicDomain: string = AppConfig.S3_PUBLIC_DOMAIN;

  constructor() {}

  async generateSignedUploadURL(
    filePath: string,
    fileType: FileType,
    ttl: number,
    _maxSizeBytes?: number,
  ): Promise<string> {
    try {
      const putUrl = await getSignedUrl(
        this.client,
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: filePath,
          ContentType: fileType,
        }),
        {
          expiresIn: ttl,
        },
      );

      return putUrl;
    } catch (error) {
      throw new ApplicationError(
        GenericErrorMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCodes.InternalServerError,
        ErrorCode.SYSTEM_INTERNAL_ERROR,
        {
          location: "S3StorageService.generateSignedUploadURL",
          description: "Failed to generate presigned upload URL",
          filePath,
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }

  async generateSignedDownloadURL(
    filePath: string,
    ttl: number,
  ): Promise<string> {
    try {
      const getUrl = await getSignedUrl(
        this.client,
        new GetObjectCommand({ Bucket: this.bucketName, Key: filePath }),
        { expiresIn: ttl },
      );

      return getUrl;
    } catch (error) {
      throw new ApplicationError(
        GenericErrorMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCodes.InternalServerError,
        ErrorCode.SYSTEM_INTERNAL_ERROR,
        {
          location: "S3StorageService.generateSignedDownloadURL",
          description: "Failed to generate presigned download URL",
          filePath,
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }

  async getPublicURL(filePath: string): Promise<string> {
    const publicDomain = this.publicDomain;
    if (!publicDomain) {
      throw new ApplicationError(
        GenericErrorMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCodes.InternalServerError,
        ErrorCode.SYSTEM_INTERNAL_ERROR,
        {
          location: "S3StorageService.getPublicURL",
          description: "S3_PUBLIC_DOMAIN environment variable is not configured",
        },
      );
    }
    const cleanDomain = publicDomain.replace(/\/$/, "");
    const cleanPath = filePath.replace(/^\//, "");
    return `${cleanDomain}/${cleanPath}`;
  }

  async moveFile(fromPath: string, toPath: string): Promise<void> {
    try {
      const copyCommand = new CopyObjectCommand({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${fromPath}`,
        Key: toPath,
      });

      await this.client.send(copyCommand);
      await this.deleteFile(fromPath);
    } catch (error) {
      throw new ApplicationError(
        GenericErrorMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCodes.InternalServerError,
        ErrorCode.SYSTEM_INTERNAL_ERROR,
        {
          location: "S3StorageService.moveFile",
          description: "Failed to move file in S3 storage",
          fromPath,
          toPath,
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
      });

      await this.client.send(command);
    } catch (error) {
      throw new ApplicationError(
        GenericErrorMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCodes.InternalServerError,
        ErrorCode.SYSTEM_INTERNAL_ERROR,
        {
          location: "S3StorageService.deleteFile",
          description: "Failed to delete file from S3 storage",
          filePath,
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }
}

