import { ChangeUserStatusRequestDTO } from "#/application/dto/admin/users/AdminUsersDTO";

export interface IChangeUserStatusUseCase {
  execute(data: ChangeUserStatusRequestDTO): Promise<void>;
}
