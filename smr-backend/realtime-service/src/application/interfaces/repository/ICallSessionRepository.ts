import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { CallSessionEntity } from "#/domain/entities/CallSessionEntity";

export interface ICallSessionRepository extends IBaseRepository<CallSessionEntity> {
  getUserActiveCall(userId: string): Promise<CallSessionEntity | null>;
}
