import { NewChatMessageRequestDTO } from "#/contracts/dto/ChatSessionDTO";
import { ChatResponse } from "#/contracts/types/ChatTypes";

export interface INewChatMessageUseCase {
  execute(dto: NewChatMessageRequestDTO): Promise<ChatResponse>;
}
