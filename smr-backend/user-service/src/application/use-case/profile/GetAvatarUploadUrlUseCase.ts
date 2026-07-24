import { AppConfig } from "#/application.config";
import {
  GetAvatarUploadUrlRequestDTO,
  GetAvatarUploadUrlResutlDTO,
} from "#/application/dto/profile/UserProfileDTO";
import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { IGetAvatarUploadUrlUseCase } from "#/application/interfaces/use-case/profile/IGetAvatarUploadUrlUseCase";
import { ImageFileTypes } from "@sharemyride/shared";

const UPLOAD_URL_TTL_SECONDS = AppConfig.UPLOAD_URL_TTL_SECONDS;
const MAX_AVATAR_SIZE_BYTES = AppConfig.MAX_AVATAR_SIZE_BYTES;

const EXTENSION_MAP: Record<ImageFileTypes, string> = {
  [ImageFileTypes.JPG]: "jpg",
  [ImageFileTypes.PNG]: "png",
  [ImageFileTypes.WEBP]: "webp",
};

/**
 * This use case creates and returns a signed url for image upload.
 * Url is set to have a fixed file type and ttl
 */
export class GetAvatarUploadUrlUseCase implements IGetAvatarUploadUrlUseCase {
  constructor(private readonly _storageService: IStorageService) {}

  async execute(
    dto: GetAvatarUploadUrlRequestDTO,
  ): Promise<GetAvatarUploadUrlResutlDTO> {
    const ext = EXTENSION_MAP[dto.fileType] || "png";
    const profileImagePath = `user-files/${dto.userId}/avatar-${Date.now()}.${ext}`;

    const signedUrl = await this._storageService.generateSignedUploadURL(
      profileImagePath,
      dto.fileType,
      UPLOAD_URL_TTL_SECONDS,
      MAX_AVATAR_SIZE_BYTES,
    );

    const expiresAt = new Date(Date.now() + UPLOAD_URL_TTL_SECONDS * 1000);

    return {
      url: signedUrl,
      expiresAt,
    };
  }
}
