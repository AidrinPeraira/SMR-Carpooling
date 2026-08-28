import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { IAddChatMembersUseCase } from "#/application/interfaces/use-cases/chat/IAddChatMembersUseCase";

/**
 * This class implements the use case that adds a valid member / user id
 * to the members list in the chat collection
 */
export class AddChatMemberUseCase implements IAddChatMembersUseCase {
  constructor(private readonly _chatRepositroy: IChatRepository) {}

  async execute(tripId: string, userId: string): Promise<void> {
    const chat = await this._chatRepositroy.findByCustomId(tripId);
    if (!chat) return;

    if (!chat.members.includes(userId)) {
      chat.members.push(userId);
      await this._chatRepositroy.updateByCustomId(tripId, { members: chat.members });
    }
  }
}
