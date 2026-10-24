import { NewChatSessionRequestDTO } from "#/contracts/dto/ChatSessionDTO";
import { IChatSessionStore } from "#/contracts/interfaces/store/IChatSessionStore";
import { INewChatSessionUseCase } from "#/contracts/interfaces/use-case/INewChatSessionUseCase";
import { ChatSession } from "#/contracts/entity/ChatSessionEntity";

/**
 * This class implements the use case that handles creating
 * a new user chat session.
 */
export class NewChatSessionUseCase implements INewChatSessionUseCase {
  constructor(private readonly _chatSessionStore: IChatSessionStore) {}

  async execute(dto: NewChatSessionRequestDTO): Promise<void> {
    //clear any existing chat
    await this._chatSessionStore.clearChatSession(dto.userId);

    const now = new Date();

    const newChatSession: ChatSession = {
      userId: dto.userId,
      userRole: dto.userRole,
      messages: [],
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };

    await this._chatSessionStore.createSession(dto.userId, newChatSession);
  }
}
