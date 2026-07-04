import { GetUserResultDTO } from "#/application/dto/profile/GetUserDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IGetUserUseCase } from "#/application/interfaces/use-case/profile/IGetUserUseCase";
import {
  ApplicationError,
  ErrorCode,
  GenericErrorMessage,
  HttpStatusCodes,
  UserErrorMessage,
} from "@smr/shared";

export class GetUserUseCase implements IGetUserUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<GetUserResultDTO> {
    if (!userId) {
      throw new ApplicationError(
        GenericErrorMessage.BAD_REQUEST,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        { reason: "User ID is required." },
      );
    }

    const existingUser = await this._userRepository.findByCustomId(userId);

    if (!existingUser) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        { userId },
      );
    }

    return {
      user: {
        userId: existingUser.userId,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        emailId: existingUser.emailId,
        userRole: existingUser.userRole,
        profileImage: existingUser.profileImage,
      },
    };
  }
}
