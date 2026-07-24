import {
  UpdateAvatarRequestDTO,
  UpdateAvatarResponseDTO,
} from "#/application/dto/profile/UserProfileDTO";

/**
 * This use case should take the credentials of the uploaded image.
 * update the database entry and rerutn the new url to the file
 */
export interface IUpdateAvatarUseCase {
  execute(dto: UpdateAvatarRequestDTO): Promise<UpdateAvatarResponseDTO>;
}
