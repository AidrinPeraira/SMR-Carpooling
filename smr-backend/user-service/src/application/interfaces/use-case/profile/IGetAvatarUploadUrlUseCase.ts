import {
  GetAvatarUploadUrlRequestDTO,
  GetAvatarUploadUrlResutlDTO,
} from "#/application/dto/profile/UserProfileDTO";

/**
 * This use case should implement a method to create valid pre signed url
 * for uploading a new profile image for the user.
 *
 * (Use file types from shared enums)
 */
export interface IGetAvatarUploadUrlUseCase {
  execute(
    dto: GetAvatarUploadUrlRequestDTO,
  ): Promise<GetAvatarUploadUrlResutlDTO>;
}
