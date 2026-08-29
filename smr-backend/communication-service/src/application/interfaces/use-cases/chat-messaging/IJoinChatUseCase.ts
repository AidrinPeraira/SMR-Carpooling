export interface IJoinChatUseCase {
  execute(userId: string, chatId: string, socketId: string): Promise<void>;
}
