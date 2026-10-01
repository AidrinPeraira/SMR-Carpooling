import {
  SyncChatMessagesRequestDTO,
  SyncChatMessagesResponseDTO,
} from "#/application/dto/ChatDTO";
import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { IMessageRepository } from "#/application/interfaces/repository/IMessageRepository";
import { ISyncMessagesUseCase } from "#/application/interfaces/use-cases/chat-message/ISyncMessagesUseCase";
import {
  ApplicationError,
  ChatErrorMessage,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
} from "@sharemyride/shared";

export class SyncChatMessagesUseCase implements ISyncMessagesUseCase {
  constructor(
    private readonly _chatRepository: IChatRepository,
    private readonly _messagesRepository: IMessageRepository,
  ) {}

  async execute(
    dto: SyncChatMessagesRequestDTO,
  ): Promise<SyncChatMessagesResponseDTO> {
    const chat = await this._chatRepository.findByTripId(dto.tripId);

    if (!chat) {
      throw new ApplicationError(
        ChatErrorMessage.CHAT_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "SyncChatMessagesUseCase",
          details: `Chat not found for tripId: ${dto.tripId}`,
        },
      );
    }

    const messages = await this._messagesRepository.findByChatId(chat.chatId);

    return {
      chatId: chat.chatId,
      isActive: chat.isActive,
      messages: messages.map((m) => ({
        id: m.id,
        body: m.body,
        senderName: m.senderName,
      })),
    };
  }
}
