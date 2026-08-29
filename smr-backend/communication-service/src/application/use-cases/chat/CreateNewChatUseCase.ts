import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { ICreateNewChatUseCase } from "#/application/interfaces/use-cases/chat/ICreateNewChatUseCase";

/**
 * This use case creates a new chat record
 * for when a new trip is created
 */
export class CreateNewChatUseCase implements ICreateNewChatUseCase {
  constructor(
    private readonly _chatRepository: IChatRepository,
    private readonly _uidGenerator: IUniqueIdGenerator,
  ) {}

  async execute(tripId: string): Promise<void> {
    await this._chatRepository.save({
      chatId: this._uidGenerator.generateRandomId(),
      tripId,
      isActive: true,
      members: [],
    });
  }
}
