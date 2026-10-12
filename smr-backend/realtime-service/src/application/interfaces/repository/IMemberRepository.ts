import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { MemberEntity } from "#/domain/entities/MemeberEntity";

/**
 * This is the repository interface for users' data
 */
export interface IMemberRepository extends IBaseRepository<MemberEntity> {
  addActiveTrip(userId: string, tripId: string): Promise<void>;
  removeActiveTrip(userId: string, tripId: string): Promise<void>;
}
