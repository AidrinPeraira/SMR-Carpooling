/**
 * This use case removes a member for
 * members list in a chat record
 */
export interface IRemoveChatMembersUseCase {
  execute(tripId: string, userId: string): Promise<void>;
}
