/**
 * Adds a member to a chat gorup
 */
export interface IAddChatMembersUseCase {
  execute(tripId: string, userId: string): Promise<void>;
}
