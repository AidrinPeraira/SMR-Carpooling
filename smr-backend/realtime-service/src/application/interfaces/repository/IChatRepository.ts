import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { ChatEntity } from "#/domain/entities/ChatEntity";

/**
 * This repository handles persistance for the
 * chat aggregate. Chat and Chat messages
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IChatRepository extends IBaseRepository<ChatEntity> {}
