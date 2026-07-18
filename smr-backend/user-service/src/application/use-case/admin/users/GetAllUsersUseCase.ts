import {
  GetAllUsersRequestQueryDTO,
  GetAllUsersResponseDTO,
} from "#/application/dto/admin/users/AdminUsersDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IGetAllUsersUseCase } from "#/application/interfaces/use-case/admin/users/IGetAllUsersUseCase";
import { UserEntity } from "#/domain/entities/UserEntity";
import { PaginatedPayload } from "@smr/shared";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(
    query: GetAllUsersRequestQueryDTO,
  ): Promise<PaginatedPayload<GetAllUsersResponseDTO[]>> {
    const searchFields: (keyof UserEntity)[] = [
      "firstName",
      "lastName",
      "emailId",
      "phoneNumber",
    ];

    const queryWithSearchFields = {
      ...query,
      searchFields: query.search ? searchFields : undefined,
    };

    const result = await this._userRepository.find(queryWithSearchFields);
    return {
      data: result.data.map((user) => {
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
      }),

      paginationMeta: result.paginationMeta,
    };
  }
}
