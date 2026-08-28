import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { ChatEntity } from "#/domain/entities/ChatEntity";
import { ChatDoc } from "#/infrastructure/database/models/MongoChatModel";
import { BaseRepository } from "#/infrastructure/repository/BaseRepository";
import { Model } from "mongoose";

export class ChatRepository
  extends BaseRepository<ChatEntity, ChatDoc>
  implements IChatRepository
{
  constructor(_chatModel: Model<ChatDoc>) {
    super("tripId", _chatModel);
  }

  protected toDomainEntityMapper(data: ChatDoc): ChatEntity {
    return {
      id: data._id.toString(),
      chatId: data.chatId,
      tripId: data.tripId,
      isActive: data.isActive,
      members: data.members ?? [],
    };
  }
}
