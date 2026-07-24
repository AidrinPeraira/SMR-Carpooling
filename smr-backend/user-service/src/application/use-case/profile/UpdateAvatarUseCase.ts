import {
  UpdateAvatarRequestDTO,
  UpdateAvatarResponseDTO,
} from "#/application/dto/profile/UserProfileDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { IUpdateAvatarUseCase } from "#/application/interfaces/use-case/profile/IUpdateAvatarUseCase";
import {
  ApplicationError,
  ErrorCode,
  HttpStatusCodes,
  ILogger,
  UserErrorMessage,
} from "@sharemyride/shared";

/**
 * This class verified the updated profile image.
 * It checks the user, updates user db.
 */
export class UpdateAvatarUseCase implements IUpdateAvatarUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _storageService: IStorageService,
    private readonly _logger: ILogger,
  ) {}

  async execute(dto: UpdateAvatarRequestDTO): Promise<UpdateAvatarResponseDTO> {
    const existingUser = await this._userRepository.findByCustomId(dto.userId);

    if (!existingUser) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        {
          location: "UpdateAvatarUseCase",
          description: "User not found",
          userId: dto.userId,
        },
      );
    }

    const publicUrl = await this._storageService.getPublicURL(dto.profileImage);

    await this._userRepository.updateById(existingUser.id, {
      profileImage: dto.profileImage,
      updatedAt: new Date(),
    });

    if (existingUser.profileImage) {
      try {
        await this._storageService.deleteFile(existingUser.profileImage);
      } catch (error) {
        this._logger.warn("Failed to delete previous avatar from storage", {
          userId: dto.userId,
          oldProfileImage: existingUser.profileImage,
          error,
        });
      }
    }

    return {
      profileImage: publicUrl,
    };
  }
}

