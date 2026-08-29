import { ChatMessageDTO } from "@sharemyride/shared";

export interface ISyncChatHistoryUseCase {
  execute(chatId: string, userId: string): Promise<ChatMessageDTO[]>;
}
