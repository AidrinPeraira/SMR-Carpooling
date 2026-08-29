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
