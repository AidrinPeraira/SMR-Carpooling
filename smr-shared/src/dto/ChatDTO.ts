export interface ChatMessageDTO {
  id: string;
  chat_id: string;
  body: string;
  sender_id: string;
  sender_name: string;
  created_at: string;
}

export interface SendChatMessageDTO {
  chat_id: string;
  body: string;
}

export interface JoinTripChatDTO {
  trip_id: string;
}

export interface LeaveTripChatDTO {
  chat_id: string;
}

export interface SyncChatMessagesRequest {
  trip_id: string;
}

export interface SyncChatMessagesResponse {
  chat_id: string;
  is_active: boolean;
  messages: Pick<ChatMessageDTO, "id" | "body" | "sender_name">[];
}
