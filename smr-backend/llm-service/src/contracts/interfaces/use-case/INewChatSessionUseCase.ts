import { NewChatSessionRequestDTO } from "#/contracts/dto/ChatSessionDTO";

/**
 * This use case handles creating a new chat session
 * for a user.
 */
export interface INewChatSessionUseCase {
  execute(dto: NewChatSessionRequestDTO): Promise<void>;
}
