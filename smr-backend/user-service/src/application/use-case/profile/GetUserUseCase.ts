import { GetUserResultDTO } from "#/application/dto/profile/UserProfileDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IGetUserUseCase } from "#/application/interfaces/use-case/profile/IGetUserUseCase";
import {
  ApplicationError,
  ErrorCode,
  GenericErrorMessage,
  HttpStatusCodes,
  UserErrorMessage,
} from "@sharemyride/shared";

export class GetUserUseCase implements IGetUserUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<GetUserResultDTO> {
    if (!userId) {
      throw new ApplicationError(
        GenericErrorMessage.BAD_REQUEST,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        {
          location: "Get user use case",
          description: "User ID is required.",
          reason: "User ID is required.",
        },
      );
    }

    const existingUser = await this._userRepository.findByCustomId(userId);

    if (!existingUser) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        {
          location: "Get user use case",
          description: "User not found in repository",
          userId,
        },
      );
    }

    console.log("Profile URL: ", existingUser.profileImage);

    return {
      userId: existingUser.userId,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      emailId: existingUser.emailId,
      userRole: existingUser.userRole,
      phoneNumber: existingUser.phoneNumber,
      isDriver: existingUser.isDriver,
      createdAt: existingUser.createdAt,
      profileImage: existingUser.profileImage,
    };
  }
}
