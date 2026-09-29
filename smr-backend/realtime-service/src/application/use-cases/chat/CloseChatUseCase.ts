import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { ICloseChatUseCase } from "#/application/interfaces/use-cases/chat/ICloseChatUseCase";

/**
 * This class implements the use case for
 * marking a chat as inactive for when
 * a trip is completed or cancelled
 */
export class CloseChatUseCase implements ICloseChatUseCase {
  constructor(private readonly _chatRepository: IChatRepository) {}

  async execute(tripId: string): Promise<void> {
    await this._chatRepository.updateByCustomId(tripId, { isActive: false });
  }
}
