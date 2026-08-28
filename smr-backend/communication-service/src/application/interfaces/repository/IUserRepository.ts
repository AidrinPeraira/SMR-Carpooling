import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { MemberEntity } from "#/domain/entities/MemeberEntity";

/**
 * This is the repository interface for users' data
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IMemberRepository extends IBaseRepository<MemberEntity> {}
