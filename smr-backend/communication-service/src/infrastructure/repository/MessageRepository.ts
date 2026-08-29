import { IMessageRepository } from "#/application/interfaces/repository/IMessageRepository";
import { ChatMessageEntity } from "#/domain/entities/ChatMessageEntity";
import { MessageDoc, MessageModel } from "../database/models/MongoMessageModel";
import { BaseRepository } from "./BaseRepository";

export class MessageRepository extends BaseRepository<ChatMessageEntity, MessageDoc> implements IMessageRepository {
  constructor() {
    super("id", MessageModel);
  }

  protected toDomainEntityMapper(data: MessageDoc): ChatMessageEntity {
    return {
      id: data._id.toString(),
      chatId: data.chatId,
      body: data.body,
      senderId: data.senderId,
      senderName: data.senderName,
      createdAt: data.createdAt,
    };
  }

  async findByChatId(chatId: string): Promise<ChatMessageEntity[]> {
    const messages = await this.model.find({ chatId }).sort({ createdAt: 1 }).lean().exec();
    return messages.map((m) => this.toDomainEntityMapper(m));
  }
}
