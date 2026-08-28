import { ChatMessageEntity } from "#/domain/entities/ChatMessageEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IMessageRepository extends IBaseRepository<ChatMessageEntity> {
  findByChatId(chatId: string): Promise<ChatMessageEntity[]>;
}
