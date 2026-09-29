export interface ChatMessageEntity {
  id: string;
  chatId: string;
  body: string;
  senderId: string;
  senderName: string;
  createdAt: Date;
}
