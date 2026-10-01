import { JoinTripChatRequestDTO } from "#/application/dto/ChatDTO";
import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { IMemberRepository } from "#/application/interfaces/repository/IMemberRepository";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IJoinTripChatUseCase } from "#/application/interfaces/use-cases/chat-message/IJoinTripChatUseCase";
import {
  ApplicationError,
  ChatErrorMessage,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
} from "@sharemyride/shared";

export class JoinTripChatUseCase implements IJoinTripChatUseCase {
  constructor(
    private readonly _memberRepository: IMemberRepository,
    private readonly _chatRepository: IChatRepository,
    private readonly _socketEmitter: ISocketEmitter,
  ) {}

  async execute(dto: JoinTripChatRequestDTO, socketId: string): Promise<void> {
    const member = await this._memberRepository.findByCustomId(dto.userId);

    if (!member) {
      throw new ApplicationError(
        ChatErrorMessage.MEMBER_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "JoinTripChatUseCase",
          details: `Member not found for userId: ${dto.userId}`,
        },
      );
    }

    const tripIsActive = member.activeTrips.includes(dto.tripId);

    if (!tripIsActive) {
      throw new ApplicationError(
        ChatErrorMessage.TRIP_NOT_ACTIVE_FOR_MEMBER,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "JoinTripChatUseCase",
          details: `Trip ${dto.tripId} is not active for member ${dto.userId}`,
        },
      );
    }

    const chat = await this._chatRepository.findByTripId(dto.tripId);

    if (!chat) {
      throw new ApplicationError(
        ChatErrorMessage.CHAT_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "JoinTripChatUseCase",
          details: `Chat not found for tripId: ${dto.tripId}`,
        },
      );
    }

    if (!chat.isActive) {
      throw new ApplicationError(
        ChatErrorMessage.CHAT_NOT_ACTIVE,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "JoinTripChatUseCase",
          details: `Chat for trip ${dto.tripId} is no longer active`,
        },
      );
    }

    await this._socketEmitter.joinRoom(dto.tripId, chat.chatId);
  }
}
