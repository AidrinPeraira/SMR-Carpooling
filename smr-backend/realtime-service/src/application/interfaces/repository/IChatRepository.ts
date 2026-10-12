import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { ChatEntity } from "#/domain/entities/ChatEntity";

/**
 * This repository handles persistance for the
 * chat aggregate. Chat and Chat messages
 */
export interface IChatRepository extends IBaseRepository<ChatEntity> {
  findByTripId(tripId: string): Promise<ChatEntity | null>;
}
