import crypto from "node:crypto";
import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { ICreateNewChatUseCase } from "#/application/interfaces/use-cases/chat/ICreateNewChatUseCase";

/**
 * This use case creates a new chat record
 * for when a new trip is created
 */
export class CreateNewChatUseCase implements ICreateNewChatUseCase {
  constructor(private readonly _chatRepository: IChatRepository) {}

  async execute(tripId: string): Promise<void> {
    await this._chatRepository.save({
      chatId: crypto.randomUUID(),
      tripId,
      isActive: true,
      members: [],
    });
  }
}
