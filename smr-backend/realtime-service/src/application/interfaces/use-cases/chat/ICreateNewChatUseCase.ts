/**
 * Creates a new chat (room) for a new trip created
 */
export interface ICreateNewChatUseCase {
  execute(tripId: string): Promise<void>;
}
