import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { ChatEntity } from "#/domain/entities/ChatEntity";
import { ChatDoc } from "#/infrastructure/database/model/MongoChatModel";
import { BaseRepository } from "#/infrastructure/repository/BaseRepository";
import { Model } from "mongoose";

export class ChatRepository
  extends BaseRepository<ChatEntity, ChatDoc>
  implements IChatRepository
{
  constructor(_chatModel: Model<ChatDoc>) {
    super("chatId", _chatModel);
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

  async findByTripId(tripId: string): Promise<ChatEntity | null> {
    return this.model.findOne({ tripId: tripId });
  }
}
