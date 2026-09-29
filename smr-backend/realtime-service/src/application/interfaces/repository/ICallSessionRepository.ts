import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { CallSessionEntity } from "#/domain/entities/CallSessionEntity";

export type ICallSessionRepository = IBaseRepository<CallSessionEntity>;
