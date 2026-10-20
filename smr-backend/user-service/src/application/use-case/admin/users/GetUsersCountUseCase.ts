import { GetUsersCountResponseDTO } from "#/application/dto/admin/users/AdminUsersDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IGetUsersCountUseCase } from "#/application/interfaces/use-case/admin/users/IGetUsersCountUseCase";

export class GetUsersCountUseCase implements IGetUsersCountUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(): Promise<GetUsersCountResponseDTO> {
    return this._userRepository.getUsersCount();
  }
}
