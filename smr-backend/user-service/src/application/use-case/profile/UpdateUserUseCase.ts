import {
  UpdateUserRequestDTO,
  GetUserResultDTO,
} from "#/application/dto/profile/UserProfileDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IHashingService } from "#/application/interfaces/services/IHashingService";
import { IUpdateUserUseCase } from "#/application/interfaces/use-case/profile/IUpdateUserUseCase";
import {
  ApplicationError,
  ErrorCode,
  HttpStatusCodes,
  UserErrorMessage,
} from "@smr/shared";

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    private readonly _userRespostiry: IUserRepository,
    private readonly _hashingService: IHashingService,
  ) {}
  async execute(data: UpdateUserRequestDTO): Promise<GetUserResultDTO> {
    const existingUser = await this._userRespostiry.findByCustomId(data.userId);

    if (!existingUser) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        {
          location: "Update user use case",
          description: "User not found with matching custom ID",
          userId: data.userId,
        },
      );
    }

    const passwordMatch = this._hashingService.compareHash(
      data.password,
      existingUser.passwordHash,
    );

    if (!passwordMatch) {
      throw new ApplicationError(
        UserErrorMessage.INVALID_CREDENTIALS,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        {
          location: "Update user use case",
          description: "User updated rejected due to incorrect password",
          userId: existingUser.userId,
        },
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
