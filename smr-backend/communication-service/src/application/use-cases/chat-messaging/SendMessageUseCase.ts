import { ISendMessageUseCase, SendMessagePayload } from "#/application/interfaces/use-cases/chat-messaging/ISendMessageUseCase";
import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { IMemberRepository } from "#/application/interfaces/repository/IMemberRepository";
import { IMessageRepository } from "#/application/interfaces/repository/IMessageRepository";
import { ISocketGateway } from "#/application/interfaces/services/ISocketGateway";
import { ApplicationError, ErrorCode, HttpStatusCodes, ChatErrorMessage, ErrorDetails, ChatMessageDTO } from "@sharemyride/shared";

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private chatRepo: IChatRepository,
    private memberRepo: IMemberRepository,
    private messageRepo: IMessageRepository,
    private socketGateway: ISocketGateway
  ) {}

  async execute(payload: SendMessagePayload): Promise<ChatMessageDTO> {
    const { chatId, body, senderId } = payload;

    const chat = await this.chatRepo.findByCustomId(chatId);

    if (!chat || !chat.isActive) {
      throw new ApplicationError(
        ChatErrorMessage.CHAT_NOT_ACTIVE, 
        HttpStatusCodes.BadRequest, 
        ErrorCode.DOMAIN_CONFLICT, 
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "SendMessageUseCase",
          description: `Chat is not active with chatId: ${chatId}`,
        }
      );
    }

    if (!chat.members.includes(senderId)) {
      throw new ApplicationError(
        ChatErrorMessage.NOT_A_MEMBER, 
        HttpStatusCodes.Forbidden, 
        ErrorCode.DOMAIN_ACCESS_DENIED, 
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "SendMessageUseCase",
          description: `User ${senderId} is not a member of chat ${chatId}`,
        }
      );
    }

    const member = await this.memberRepo.findByCustomId(senderId);
    if (!member) {
      throw new ApplicationError(
        ChatErrorMessage.MEMBER_NOT_FOUND, 
        HttpStatusCodes.NotFound, 
        ErrorCode.DOMAIN_NOT_FOUND, 
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "SendMessageUseCase",
          description: `Member not found with id: ${senderId}`,
        }
      );
    }

    const senderName = `${member.firstName} ${member.lastName}`;

    const savedMessage = await this.messageRepo.save({
      chatId,
      body,
      senderId,
      senderName,
      createdAt: new Date(),
    });

    const dto: ChatMessageDTO = {
      id: savedMessage.id,
      chat_id: savedMessage.chatId,
      body: savedMessage.body,
      sender_id: savedMessage.senderId,
      sender_name: savedMessage.senderName,
      created_at: savedMessage.createdAt.toISOString(),
    };

    await this.socketGateway.emitToChat(chatId, "new_message", dto);

    return dto;
  }
}
