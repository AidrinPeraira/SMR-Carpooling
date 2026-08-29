import { ISyncChatHistoryUseCase } from "#/application/interfaces/use-cases/chat-messaging/ISyncChatHistoryUseCase";
import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { IMessageRepository } from "#/application/interfaces/repository/IMessageRepository";
import { ApplicationError, ErrorCode, HttpStatusCodes, ChatErrorMessage, ErrorDetails, ChatMessageDTO } from "@sharemyride/shared";

export class SyncChatHistoryUseCase implements ISyncChatHistoryUseCase {
  constructor(
    private chatRepo: IChatRepository,
    private messageRepo: IMessageRepository
  ) {}

  async execute(chatId: string, userId: string): Promise<ChatMessageDTO[]> {
    const chat = await this.chatRepo.findByCustomId(chatId);
    if (!chat) {
      throw new ApplicationError(
        ChatErrorMessage.CHAT_NOT_FOUND, 
        HttpStatusCodes.NotFound, 
        ErrorCode.DOMAIN_NOT_FOUND, 
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "SyncChatHistoryUseCase",
          description: `Chat not found with chatId: ${chatId}`,
        }
      );
    }

    if (!chat.members.includes(userId)) {
      throw new ApplicationError(
        ChatErrorMessage.NOT_A_MEMBER, 
        HttpStatusCodes.Forbidden, 
        ErrorCode.DOMAIN_ACCESS_DENIED, 
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "SyncChatHistoryUseCase",
          description: `User ${userId} is not a member of chat ${chatId}`,
        }
      );
    }

    const messages = await this.messageRepo.findByChatId(chatId);

    return messages.map((msg) => ({
      id: msg.id,
      chat_id: msg.chatId,
      body: msg.body,
      sender_id: msg.senderId,
      sender_name: msg.senderName,
      created_at: msg.createdAt.toISOString(),
    }));
  }
}
