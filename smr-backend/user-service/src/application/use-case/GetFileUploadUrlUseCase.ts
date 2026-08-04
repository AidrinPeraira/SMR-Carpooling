import { AppConfig } from "#/application.config";
import { GetFileUploadUrlRequestDTO } from "#/application/dto/GetFileUploadUrlRequestDTO";
import { GetFileUploadUrlResponseDTO } from "#/application/dto/GetFileUploadUrlResponseDTO";
import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { IGetFileUploadUrlUseCase } from "#/application/interfaces/use-case/IGetFileUploadUrlUseCase";
import { ImageFileTypes } from "@sharemyride/shared";

const UPLOAD_URL_TTL_SECONDS = AppConfig.UPLOAD_URL_TTL_SECONDS;

const EXTENSION_MAP: Record<ImageFileTypes, string> = {
  [ImageFileTypes.JPG]: "jpg",
  [ImageFileTypes.PNG]: "png",
  [ImageFileTypes.WEBP]: "webp",
};

/**
 * This is the implementation for the use case that generrates a signed url for
 * file upload
 */
export class GetFileUploadUrlUseCase implements IGetFileUploadUrlUseCase {
  constructor(private readonly _storageService: IStorageService) {}

  /**
   * This method crates a short lived signed url for file upload. The file is uploaded
   * to the paths "temp/user-files/<userId>/<fileName>-<timeInMs>.<fileType>"
   * (The storage service is set to delete temp files every 24 hours)
   *
   * @param data : Details for file upload (filename,type, userId)
   * @returns signed url and expiresAt for signed url
   */
  async execute(
    data: GetFileUploadUrlRequestDTO,
  ): Promise<GetFileUploadUrlResponseDTO> {
    const ext = EXTENSION_MAP[data.fileType] || "png";
    const filePath = `temp/user-files/${data.userId}/${data.fileName}-${Date.now()}.${ext}`;

    const signedUrl = await this._storageService.generateSignedUploadURL(
      filePath,
      data.fileType,
      UPLOAD_URL_TTL_SECONDS,
    );

    const expiresAt = new Date(Date.now() + UPLOAD_URL_TTL_SECONDS * 1000);

    return {
      url: signedUrl,
      expiresAt,
    };
  }
}
