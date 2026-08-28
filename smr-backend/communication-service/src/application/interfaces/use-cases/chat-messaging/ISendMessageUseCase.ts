import { ChatMessageDTO } from "@sharemyride/shared";

export interface SendMessagePayload {
  chatId: string;
  body: string;
  senderId: string;
}

export interface ISendMessageUseCase {
  execute(payload: SendMessagePayload): Promise<ChatMessageDTO>;
}
