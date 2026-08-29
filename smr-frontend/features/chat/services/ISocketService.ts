import { ChatMessageDTO } from "@sharemyride/shared";

export interface ISocketService {
  connect(userId: string): void;
  disconnect(): void;
  joinChat(chatId: string): void;
  sendMessage(chatId: string, body: string): void;
  syncHistory(chatId: string): void;
  onHistory(callback: (messages: ChatMessageDTO[]) => void): void;
  onMessage(callback: (message: ChatMessageDTO) => void): void;
  offHistory(callback: (messages: ChatMessageDTO[]) => void): void;
  offMessage(callback: (message: ChatMessageDTO) => void): void;
}
