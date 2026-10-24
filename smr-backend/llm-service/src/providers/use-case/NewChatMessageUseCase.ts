import { NewChatMessageRequestDTO } from "#/contracts/dto/ChatSessionDTO";
import { ILlmProvider } from "#/contracts/interfaces/services/ILlmProvider";
import { IChatSessionStore } from "#/contracts/interfaces/store/IChatSessionStore";
import { INewChatMessageUseCase } from "#/contracts/interfaces/use-case/INewChatMessageUseCase";
import { ChatResponse } from "#/contracts/types/ChatTypes";

export class NewChatMessageUseCase implements INewChatMessageUseCase {
  constructor(
    private readonly _chatSessionStore: IChatSessionStore,
    private readonly _llmServiceProvider: ILlmProvider,
  ) {}

  async execute(dto: NewChatMessageRequestDTO): Promise<ChatResponse> {
    const chatSession = await this._chatSessionStore.findChatSession(
      dto.userId,
    );

    /**
     * Decision Needed:
     *  - Change this to a custom application error from shared
     *  - or remove new session use case and create a new chat sesion if not found
     */
    if (!chatSession) {
      throw new Error("no chat session found");
    }

    return {} as any;
  }
}
