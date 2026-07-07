import {
  GetAllUsersRequestQueryDTO,
  GetUserResultDTO,
} from "#/application/dto/profile/UserProfileDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IGetAllUsersUseCase } from "#/application/interfaces/use-case/profile/IGetAllUsersUseCase";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(
    query: GetAllUsersRequestQueryDTO,
  ): Promise<GetUserResultDTO[]> {
    const users = await this._userRepository.find(query);
    return users.map((user) => {
      return {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        userRole: user.userRole,
        phoneNumber: user.phoneNumber,
        isDriver: user.isDriver,
        createdAt: user.createdAt,
        profileImage: user.profileImage,
      };
    });
  }
}
