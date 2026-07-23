/**
 * This use case should implement a method to create valid pre signed url
 * for uploading a new profile image for the user.
 *
 * (Use file types from shared enums)
 */
import { ImageFileTypes } from "@sharemyride/shared";

export interface GetAvatarUploadUrlRequestDTO {
  userId: string;
  fileType: ImageFileTypes;
}

export interface IGetAvatarUploadUrlUseCase {
  execute(dto: GetAvatarUploadUrlRequestDTO): Promise<string>;
}
