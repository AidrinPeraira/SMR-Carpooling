import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { UserEntity } from "#/domain/entities/UserEntity";

/**
 * This is the repository interface for users' data
 */
export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
}
