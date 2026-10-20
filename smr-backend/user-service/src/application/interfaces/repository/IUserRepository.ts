import { GetUsersCountResponseDTO } from "#/application/dto/admin/users/AdminUsersDTO";
import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { UserEntity } from "#/domain/entities/UserEntity";

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  getUsersCount(): Promise<GetUsersCountResponseDTO>;
}
