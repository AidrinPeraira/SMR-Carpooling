import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { IRemoveChatMembersUseCase } from "#/application/interfaces/use-cases/chat/IRemoveChatMembersUseCase";

/**
 * This class implements the use case that removes
 * member / user form the list of members in a chat
 * on booking cancelation or trip completion
 */
export class RemoveChatMembersUseCase implements IRemoveChatMembersUseCase {
  constructor(private readonly _chatRepository: IChatRepository) {}

  async execute(tripId: string, userId: string): Promise<void> {
    const chat = await this._chatRepository.findByCustomId(tripId);
    if (!chat) return;

    const updatedMembers = chat.members.filter(id => id !== userId);
    await this._chatRepository.updateByCustomId(tripId, { members: updatedMembers });
  }
}
