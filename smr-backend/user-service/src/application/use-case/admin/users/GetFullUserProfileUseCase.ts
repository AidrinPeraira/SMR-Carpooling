import { GetFullUserProfileResponseDTO } from "#/application/dto/admin/users/AdminUsersDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IGetFullUserProfileUseCase } from "#/application/interfaces/use-case/admin/users/IGetFullUserProfileUseCase";
import {
  ApplicationError,
  ErrorCode,
  GenericErrorMessage,
  HttpStatusCodes,
  UserErrorMessage,
} from "@smr/shared";

export class GetFullUserProfileUseCase implements IGetFullUserProfileUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  /**
   * This method takes the validated user id string and finds the
   * corresponsding user from the reopsitory. and returns the data fro the client
   *
   * @param userId : custom id of the user
   * @returns User details as response DTO
   */
  async execute(userId: string): Promise<GetFullUserProfileResponseDTO> {
    if (!userId) {
      throw new ApplicationError(
        GenericErrorMessage.BAD_REQUEST,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        {
          location: "Get full user profile use case",
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
          location: "Get full user profile use case",
          description: "User not found in repository",
          userId,
        },
      );
    }

    return {
      userId: existingUser.userId,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      emailId: existingUser.emailId,
      userRole: existingUser.userRole,
      accountStatus: existingUser.accountStatus,
      emailVerified: existingUser.emailVerified,
      isDriver: existingUser.isDriver,
      phoneNumber: existingUser.phoneNumber,
      profileImage: existingUser.profileImage,
      createdAt: existingUser.createdAt,
    };
  }
}
