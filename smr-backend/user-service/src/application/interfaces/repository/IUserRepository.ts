import { UserEntity } from "#/domain/entities/UserEntity";
import { IBaseRepository } from "./IBaseRepository";



export interface IUserRepository extends IBaseRepository<UserEntity> {

  findByEmail(email: string): Promise<UserEntity | null>;
}
