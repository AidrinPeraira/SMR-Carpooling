import {
  JoinTripChatRequestDTO,
  LeaveTripChatRequestDTO,
  SendMessageRequestDTO,
  SyncChatMessagesRequestDTO,
  SyncChatMessagesResponseDTO,
} from "#/application/dto/ChatDTO";
import {
  JoinTripChatDTO,
  LeaveTripChatDTO,
  SendChatMessageDTO,
  SyncChatMessagesRequest,
  SyncChatMessagesResponse,
} from "@sharemyride/shared";

export class ChatSocketMapper {
  static toJoinTripChatRequestDTO(
    payload: JoinTripChatDTO,
    userId: string,
  ): JoinTripChatRequestDTO {
    return {
      userId,
      tripId: payload.trip_id,
    };
  }

  static toLeaveTripChatRequestDTO(
    payload: LeaveTripChatDTO,
  ): LeaveTripChatRequestDTO {
    return {
      chatId: payload.chat_id,
    };
  }

  static toSendMessageRequestDTO(
    payload: SendChatMessageDTO,
    senderId: string,
    senderName: string,
  ): SendMessageRequestDTO {
    return {
      chatId: payload.chat_id,
      message: payload.body,
      senderId,
      senderName,
    };
  }

  static toSyncChatMessagesRequestDTO(
    payload: SyncChatMessagesRequest,
    userId: string,
  ): SyncChatMessagesRequestDTO {
    return {
      userId,
      tripId: payload.trip_id,
    };
  }

  static toSyncChatMessagesResponse(
    dto: SyncChatMessagesResponseDTO,
  ): SyncChatMessagesResponse {
    return {
      chat_id: dto.chatId,
      is_active: dto.isActive,
      messages: dto.messages.map((m) => ({
        id: m.id,
        body: m.body,
        sender_name: m.senderName,
      })),
    };
  }
}
