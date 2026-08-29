import { IJoinChatUseCase } from "#/application/interfaces/use-cases/chat-messaging/IJoinChatUseCase";
import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { ISocketGateway } from "#/application/interfaces/services/ISocketGateway";

export class JoinChatUseCase implements IJoinChatUseCase {
  constructor(
    private chatRepo: IChatRepository,
    private socketGateway: ISocketGateway
  ) {}

  async execute(userId: string, chatId: string, _socketId: string): Promise<void> {
    const chat = await this.chatRepo.findByCustomId(chatId);
    if (chat && chat.isActive && chat.members.includes(userId)) {
      await this.socketGateway.joinRoom(userId, `chat_${chatId}`);
    }
  }
}
