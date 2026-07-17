import {
  GetAllUsersRequestQueryDTO,
  GetAllUsersResponseDTO,
} from "#/application/dto/admin/users/AdminUsersDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IGetAllUsersUseCase } from "#/application/interfaces/use-case/admin/users/IGetAllUsersUseCase";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(
    query: GetAllUsersRequestQueryDTO,
  ): Promise<GetAllUsersResponseDTO[]> {
    const users = await this._userRepository.find(query);
    return users.map((user) => {
      return {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        userRole: user.userRole,
        accountStatus: user.accountStatus,
        phoneNumber: user.phoneNumber,
        isDriver: user.isDriver,
        createdAt: user.createdAt,
        profileImage: user.profileImage,
      };
    });
  }
}
