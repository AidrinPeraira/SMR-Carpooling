import {
  UpdateUserRequestDTO,
  GetUserResultDTO,
} from "#/application/dto/profile/UserProfileDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IUpdateUserUseCase } from "#/application/interfaces/use-case/profile/IUpdateUserUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  UserErrorMessage,
} from "@smr/shared";

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(private readonly _userRespostiry: IUserRepository) {}
  async execute(data: UpdateUserRequestDTO): Promise<GetUserResultDTO> {
    const existingUser = await this._userRespostiry.findByCustomId(data.userId);

    if (!existingUser) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
      );
    }

    const updatedUser = await this._userRespostiry.updateById(existingUser.id, {
      ...data,
      updatedAt: new Date(),
    });

    return {
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        emailId: updatedUser.emailId,
        userId: updatedUser.userId,
        userRole: updatedUser.userRole,
        profileImage: updatedUser.profileImage,
        createdAt: updatedUser.createdAt,
        isDriver: updatedUser.isDriver,
        phoneNumber: updatedUser.phoneNumber,
      },
    };
  }
}
