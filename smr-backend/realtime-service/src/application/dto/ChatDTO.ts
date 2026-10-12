export interface JoinTripChatRequestDTO {
  userId: string;
  tripId: string;
}

export interface LeaveTripChatRequestDTO {
  chatId: string;
}

export interface SendMessageRequestDTO {
  chatId: string;
  message: string;
  senderId: string; //from token
  senderName: string; //from token
}

export interface SyncChatMessagesRequestDTO {
  userId: string;
  tripId: string;
}

export interface SyncChatMessagesResponseDTO {
  chatId: string;
  isActive: boolean;
  messages: ChatMessageDTO[];
}

interface ChatMessageDTO {
  id: string;
  body: string;
  senderName: string;
}
